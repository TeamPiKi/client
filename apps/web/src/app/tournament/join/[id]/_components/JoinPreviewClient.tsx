'use client';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { usePatchMe } from '@/app/mypage/edit/_hooks/usePatchMe';
import { EditIconFill } from '@/assets/icons/fill';
import Button from '@/components/button';
import { Header } from '@/components/header';
import Input from '@/components/input';
import Spinner from '@/components/spinner';
import TournamentErrorDialog from '@/components/tournament-error-dialog';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';
import { useNicknameValidation } from '@/hooks/useNicknameValidation';
import { usePageBackground } from '@/hooks/usePageBackground';
import type { ApiErrorResponseT } from '@/types/api';

import { useGetInvitePreview } from '../../_hooks/useGetInvitePreview';
import { usePostJoin } from '../../_hooks/usePostJoin';

type JoinPreviewClientProps = {
  tournamentId: number;
  /** 친구 초대 코드 — invite 진입 시 query 로 전달됨. join 호출 시 필수 */
  inviteCode: string;
};

const MAX_NICKNAME_LENGTH = 10;

/**
 * 회원 자동 참여 화면 상태.
 * - joining: 참여 요청 진행 중 (스피너)
 * - retryable: 일시적 실패 — 재시도 가능
 * - blocked: 409(이미 참여 / 만료) — 재시도가 무의미하므로 종료 화면
 */
type AutoJoinStatusT = 'joining' | 'retryable' | 'blocked';

function JoinPreviewClient({ tournamentId, inviteCode }: JoinPreviewClientProps) {
  /** 이 페이지는 흰색 배경(bg-layer-default) — iOS 노치 영역까지 흰색으로 칠해야 자연스럽다. */
  usePageBackground('var(--color-bg-layer-default)');

  const router = useRouter();
  const { userData } = useGetMe();
  const { invitePreviewData } = useGetInvitePreview(tournamentId);
  const { patchMeMutation, isPatchMePending } = usePatchMe();
  const { postJoinMutation, isPostJoinPending } = usePostJoin();

  const [nickname, setNickname] = useState(userData.nickname);
  const [isTournamentErrorDialogOpen, setIsTournamentErrorDialogOpen] = useState(false);
  const [autoJoinStatus, setAutoJoinStatus] = useState<AutoJoinStatusT>('joining');

  const {
    isCheckingNickname,
    isNicknameChanged,
    isNicknameValid,
    nicknameErrorText,
    trimmedNickname,
  } = useNicknameValidation(nickname, userData.nickname);

  const isComplete =
    isNicknameValid && !isCheckingNickname && !isPostJoinPending && !isPatchMePending;

  const joinTournament = useCallback(() => {
    postJoinMutation(
      {
        tournamentId,
        body: { ...(inviteCode ? { inviteCode } : {}) },
      },
      {
        /** 참여 완료 후 뒤로가기로 join 화면에 돌아오면 재참여(409)가 되므로 히스토리에서 제거 */
        onSuccess: () => {
          router.replace(
            `${ROUTES.TOURNAMENT_CREATE(tournamentId)}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.WELCOME_JOIN}`
          );
        },
        onError: error => {
          if (isAxiosError<ApiErrorResponseT>(error) && error.response?.status === 409) {
            setAutoJoinStatus('blocked');
            setIsTournamentErrorDialogOpen(true);
            return;
          }

          setAutoJoinStatus('retryable');
          toast.warning('참여에 실패했어요. 잠시 후 다시 시도해주세요.');
        },
      }
    );
  }, [inviteCode, postJoinMutation, router, tournamentId]);

  const handleConfirm = () => {
    if (!isComplete) return;

    if (isNicknameChanged) {
      patchMeMutation(
        { nickname: trimmedNickname },
        {
          onSuccess: () => joinTournament(),
        }
      );
      return;
    }

    joinTournament();
  };

  /** 회원은 닉네임 입력 없이 자동 참여 — 재호출은 ref 로 가드 */
  const isMember = userData.identityType === 'MEMBER';
  const hasAutoJoinRunRef = useRef(false);

  useEffect(() => {
    if (!isMember || hasAutoJoinRunRef.current) return;
    hasAutoJoinRunRef.current = true;

    /** 이미 참여한 회원 — join 없이 바로 이동 */
    if (invitePreviewData.joined) {
      router.replace(ROUTES.TOURNAMENT_CREATE(tournamentId));
      return;
    }

    joinTournament();
  }, [isMember, invitePreviewData.joined, router, tournamentId, joinTournament]);

  const handleRetryAutoJoin = () => {
    setAutoJoinStatus('joining');
    joinTournament();
  };

  if (isMember) {
    return (
      <>
        <main className="flex min-h-dvh items-center justify-center bg-bg-layer-default pt-padding-top">
          {autoJoinStatus === 'blocked' && (
            <div className="flex flex-col items-center gap-4">
              <p className="body-1-medium text-text-neutral-tertiary">
                참여할 수 없는 토너먼트예요.
              </p>
              <Button size="md" variant="primary" onClick={() => router.replace(ROUTES.HOME)}>
                홈으로 가기
              </Button>
            </div>
          )}

          {autoJoinStatus === 'retryable' && (
            <div className="flex flex-col items-center gap-4">
              <p className="body-1-medium text-text-neutral-tertiary">참여에 실패했어요.</p>
              <Button size="md" variant="primary" onClick={handleRetryAutoJoin}>
                다시 시도
              </Button>
            </div>
          )}

          {autoJoinStatus === 'joining' && (
            <div className="flex flex-col items-center gap-3">
              <Spinner size={32} />
              <p className="body-1-medium text-text-neutral-tertiary">
                토너먼트에 참여하고 있어요...
              </p>
            </div>
          )}
        </main>

        <TournamentErrorDialog
          type="LINK_EXPIRED"
          open={isTournamentErrorDialogOpen}
          onOpenChange={setIsTournamentErrorDialogOpen}
        />
      </>
    );
  }

  return (
    <>
      <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-8">
        <Header
          center="초대 참여하기"
          centerClassName="heading-1-bold text-text-neutral-primary"
          className="px-5"
        />

        <section className="mt-8.75 flex flex-col gap-2 px-5">
          <p className="body-2-semibold text-text-neutral-primary">공유받은 토너먼트</p>
          <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4">
            <p className="body-1-semibold text-text-neutral-primary">
              {invitePreviewData.tournamentName}
            </p>
            <p className="body-2-medium text-text-neutral-secondary">
              후보 {invitePreviewData.itemCount}개 · 참여 {invitePreviewData.participantCount}명
            </p>
          </div>
        </section>

        <section className="mt-8 px-5">
          <Input
            label="닉네임을 설정해주세요."
            value={nickname}
            onChange={event => setNickname(event.target.value)}
            right={<EditIconFill className="size-5" />}
            maxLength={MAX_NICKNAME_LENGTH}
            aria-invalid={Boolean(nicknameErrorText)}
            {...(nicknameErrorText ? { helperText: nicknameErrorText } : {})}
          />
        </section>

        <div className="mt-auto px-5">
          <Button
            size="lg"
            variant="primary"
            disabled={!isComplete}
            onClick={handleConfirm}
            isLoading={isPostJoinPending || isPatchMePending}
          >
            참여하기
          </Button>
        </div>
      </main>

      <TournamentErrorDialog
        type="LINK_EXPIRED"
        open={isTournamentErrorDialogOpen}
        onOpenChange={setIsTournamentErrorDialogOpen}
      />
    </>
  );
}

export default JoinPreviewClient;
