'use client';

import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { usePatchMe } from '@/app/mypage/edit/_hooks/usePatchMe';
import { EditIconFill } from '@/assets/icons/fill';
import Button from '@/components/button';
import { Header } from '@/components/header';
import Input from '@/components/input';
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

  const {
    isCheckingNickname,
    isNicknameChanged,
    isNicknameValid,
    nicknameErrorText,
    trimmedNickname,
  } = useNicknameValidation(nickname, userData.nickname);

  const isComplete =
    isNicknameValid && !isCheckingNickname && !isPostJoinPending && !isPatchMePending;

  const joinTournament = () => {
    postJoinMutation(
      {
        tournamentId,
        body: { ...(inviteCode ? { inviteCode } : {}) },
      },
      {
        onSuccess: () => {
          router.push(
            `${ROUTES.TOURNAMENT_CREATE(tournamentId)}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.WELCOME_JOIN}`
          );
        },
        onError: error => {
          if (isAxiosError<ApiErrorResponseT>(error) && error.response?.status === 409) {
            setIsTournamentErrorDialogOpen(true);
            return;
          }

          toast.warning('참여에 실패했어요. 잠시 후 다시 시도해주세요.');
        },
      }
    );
  };

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

  return (
    <>
      <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-8">
        <Header
          center="초대 참여하기"
          centerClassName="heading-1-bold text-text-neutral-primary"
          className="px-5"
        />

        <section className="mt-8.75 flex flex-col gap-2 px-5">
          <p className="body-2-semibold text-text-neutral-primary">초대받은 토너먼트</p>
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
