import { ERROR_CODE } from '@piki/core';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postTournamentStart } from '../_apis/postTournamentStart';

export const usePostTournamentStart = (tournamentId: number) => {
  const router = useRouter();

  const { mutate: postTournamentStartMutation, isPending: isPostTournamentStartPending } =
    useMutation({
      mutationFn: () => postTournamentStart(tournamentId),
      // 응답의 tournamentId 로 라우팅.
      // - 주최자: ROOT ID (요청 tournamentId 와 동일)
      // - 참여자: 새로 생성된 CLONE ID (이후 본인 인스턴스로 진행)
      onSuccess: ({ tournamentId: nextTournamentId }) => {
        logAnalyticsEvent(ANALYTICS_EVENT.TOURNAMENT_START, {
          tournament_id: nextTournamentId,
          source_tournament_id: tournamentId,
        });
        router.push(ROUTES.TOURNAMENT_LOADING(nextTournamentId));
      },
      onError: error => {
        if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

        const { status, data } = error.response;

        if (status === 409) {
          /** 아직 시작할 수 없는 상태 — 토너먼트는 그대로 PENDING 이므로 이동시키지 않고 사유만 안내한다. */
          if (
            data.code === ERROR_CODE.TOURNAMENT_ITEM_NOT_READY_TO_START ||
            data.code === ERROR_CODE.TOURNAMENT_ITEM_PRICE_REQUIRED
          ) {
            toast.error(getApiErrorMessage(error));
            return;
          }

          /** 그 외(PENDING 아님 = 이미 시작된 토너먼트) → 진행 중인 매치로 이동 */
          router.push(ROUTES.TOURNAMENT_MATCH(tournamentId));
          return;
        }

        if (status < 500) {
          toast.error(getApiErrorMessage(error));
        }
      },
    });

  return { postTournamentStartMutation, isPostTournamentStartPending };
};
