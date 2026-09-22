'use client';

import { ERROR_CODE, ERROR_MESSAGE_MAP } from '@piki/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import GuestSignupBanner from '@/app/tournament/_common/_components/GuestSignupBanner';
import { usePatchTournamentNickname } from '@/app/tournament/join/_hooks/usePatchTournamentNickname';
import { usePostJoin } from '@/app/tournament/join/_hooks/usePostJoin';
import { usePostJoinGuest } from '@/app/tournament/join/_hooks/usePostJoinGuest';
import { EditIconFill } from '@/assets/icons/fill';
import Button from '@/components/button';
import type { JoinErrorTypeT } from '@/components/common/join-error-dialog';
import JoinErrorDialog from '@/components/common/join-error-dialog';
import TermsAgreementNotice from '@/components/common/terms-agreement-notice';
import { Header } from '@/components/header';
import Input from '@/components/input';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { LOGIN_SOURCE } from '@/consts/loginSource';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';
import { useNicknameValidation } from '@/hooks/useNicknameValidation';
import { usePageBackground } from '@/hooks/usePageBackground';
import type { GetInvitePreviewResponseT } from '@/types/tournament';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getLoginPath } from '@/utils/loginRedirect';

type JoinPreviewClientProps = {
  tournamentId: number;
  /** 친구 초대 코드 — 링크 query 로 전달됨. join 호출 시 필수 */
  inviteCode: string;
  /** 링크 유효성과 함께 RSC 가 이미 조회한 미리보기 */
  preview: GetInvitePreviewResponseT;
  /** 무토큰이면 참여하기 클릭 시 join/guest 로 게스트 발급+참여를 한 번에 처리 */
  hasToken: boolean;
};

type JoinPreviewFormProps = Omit<JoinPreviewClientProps, 'hasToken'> & {
  initialNickname: string;
  isGuest: boolean;
};

const MAX_NICKNAME_LENGTH = 10;
const DUPLICATE_NICKNAME_ERROR_TEXT = ERROR_MESSAGE_MAP[ERROR_CODE.USER_DUPLICATE_NICKNAME];

function JoinPreviewClient({ hasToken, ...props }: JoinPreviewClientProps) {
  if (!hasToken) return <JoinPreviewForm {...props} initialNickname="" isGuest />;

  return <MemberJoinPreview {...props} />;
}

/** useGetMe가 무토큰일 때 로그인 리다이렉트를 유발하므로 토큰 있는 경우에만 분리 호출 */
function MemberJoinPreview(props: Omit<JoinPreviewClientProps, 'hasToken'>) {
  const { userData } = useGetMe();

  return <JoinPreviewForm {...props} initialNickname={userData.nickname} isGuest={false} />;
}

function JoinPreviewForm({
  tournamentId,
  inviteCode,
  preview,
  initialNickname,
  isGuest,
}: JoinPreviewFormProps) {
  /** 이 페이지는 흰색 배경(bg-layer-default) — iOS 노치 영역까지 흰색으로 칠해야 자연스럽다. */
  usePageBackground('var(--color-bg-layer-default)');

  const router = useRouter();
  const { patchTournamentNicknameMutation, isPatchTournamentNicknamePending } =
    usePatchTournamentNickname();

  const [nickname, setNickname] = useState(initialNickname);
  const [joinErrorType, setJoinErrorType] = useState<JoinErrorTypeT | null>(null);
  /** 중복 체크 통과 후 참여 사이에 선점당한 닉네임 — 재입력 안내 (입력 변경 시 해제) */
  const [duplicateNicknameError, setDuplicateNicknameError] = useState<string | null>(null);

  const { postJoinMutation, isPostJoinPending } = usePostJoin({
    onAlreadyJoined: () => router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId)),
    onParticipantsFull: () => setJoinErrorType('PARTICIPANTS_FULL'),
    onAlreadyStarted: () => setJoinErrorType('ALREADY_STARTED'),
    onUnavailable: () => setJoinErrorType('LINK_EXPIRED'),
    onDeleted: () => setJoinErrorType('DELETED'),
  });

  const { postJoinGuestMutation, isPostJoinGuestPending } = usePostJoinGuest({
    onDuplicateNickname: () => setDuplicateNicknameError(DUPLICATE_NICKNAME_ERROR_TEXT),
    onParticipantsFull: () => setJoinErrorType('PARTICIPANTS_FULL'),
    onAlreadyStarted: () => setJoinErrorType('ALREADY_STARTED'),
    onUnavailable: () => setJoinErrorType('LINK_EXPIRED'),
    onDeleted: () => setJoinErrorType('DELETED'),
  });

  const {
    isCheckingNickname,
    isNicknameChanged,
    isNicknameValid,
    nicknameErrorText,
    trimmedNickname,
  } = useNicknameValidation(nickname, initialNickname);

  const helperText = nicknameErrorText ?? duplicateNicknameError;

  const loginHref = getLoginPath(
    `${ROUTES.TOURNAMENT_JOIN_BY_LINK(tournamentId)}?${new URLSearchParams({ code: inviteCode })}`
  );

  const isComplete =
    isNicknameValid &&
    !duplicateNicknameError &&
    !isCheckingNickname &&
    !isPostJoinPending &&
    !isPostJoinGuestPending &&
    !isPatchTournamentNicknamePending;

  /** 참여 완료 후 뒤로가기로 join 화면에 돌아오면 재참여(409)가 되므로 히스토리에서 제거 */
  const goToTournament = useCallback(() => {
    router.replace(
      `${ROUTES.TOURNAMENT_CREATE(tournamentId)}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.WELCOME_JOIN}`
    );
  }, [router, tournamentId]);

  const handleLoginLinkClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.GUEST_BANNER_CTA_CLICK, { location: LOGIN_SOURCE.INVITE });
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setDuplicateNicknameError(null);
  };

  const handleConfirm = () => {
    if (!isComplete) return;

    if (isGuest) {
      postJoinGuestMutation(
        { tournamentId, body: { inviteCode, nickname: trimmedNickname } },
        { onSuccess: goToTournament }
      );
      return;
    }

    postJoinMutation(
      {
        tournamentId,
        body: { ...(inviteCode ? { inviteCode } : {}) },
      },
      {
        onSuccess: () => {
          if (!isNicknameChanged) {
            goToTournament();
            return;
          }

          patchTournamentNicknameMutation(
            { tournamentId, body: { nickname: trimmedNickname } },
            { onSuccess: goToTournament, onError: goToTournament }
          );
        },
      }
    );
  };

  return (
    <>
      <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-10">
        <Header
          center="초대 참여하기"
          centerClassName="heading-1-bold text-text-neutral-primary"
          className="px-5"
        />

        <section className="mt-8.75 flex flex-col gap-2 px-5">
          <p className="body-2-semibold text-text-neutral-primary">초대받은 토너먼트</p>
          <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4">
            <p className="body-1-semibold text-text-neutral-primary">{preview.tournamentName}</p>
            <p className="body-2-medium text-text-neutral-secondary">
              후보 {preview.itemCount}개 · 참여 {preview.participantCount}명
            </p>
          </div>
        </section>

        <section className="mt-8 px-5">
          <Input
            label="닉네임을 설정해주세요."
            value={nickname}
            onChange={event => handleNicknameChange(event.target.value)}
            right={<EditIconFill className="size-5" />}
            maxLength={MAX_NICKNAME_LENGTH}
            aria-invalid={Boolean(helperText)}
            {...(helperText ? { helperText } : {})}
          />
          {isGuest && <TermsAgreementNotice action="참여" className="mt-2" />}
        </section>

        <div className="mt-auto flex flex-col px-5">
          {isGuest && (
            <div className="mb-6">
              <GuestSignupBanner
                loginHref={loginHref}
                location={LOGIN_SOURCE.INVITE}
                variant="plain"
              />
            </div>
          )}
          <Button
            size="lg"
            variant="primary"
            disabled={!isComplete}
            onClick={handleConfirm}
            isLoading={
              isPostJoinPending || isPostJoinGuestPending || isPatchTournamentNicknamePending
            }
          >
            참여하기
          </Button>
          {isGuest && (
            <Link
              href={loginHref}
              onClick={handleLoginLinkClick}
              className="mt-4 self-center body-2-medium text-text-neutral-secondary underline"
            >
              이미 회원이세요? 로그인하기
            </Link>
          )}
        </div>
      </main>

      {joinErrorType && <JoinErrorDialog type={joinErrorType} />}
    </>
  );
}

export default JoinPreviewClient;
