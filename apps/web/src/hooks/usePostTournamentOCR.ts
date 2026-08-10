import { ERROR_CODE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { postTournamentOCR } from '@/apis/postTournamentOCR';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { getApiErrorCode, getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export const usePostTournamentOCR = (tournamentId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: postTournamentOCRMutation,
    isPending: isPostTournamentOCRPending,
    reset: resetPostTournamentOCRMutation,
  } = useMutation({
    mutationFn: (formData: FormData) => postTournamentOCR(tournamentId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      const code = getApiErrorCode(error);

      /** 토너먼트가 시작된 경우 */
      if (code === ERROR_CODE.TOURNAMENT_NOT_PENDING) {
        queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
        return;
      }

      /** 토너먼트가 삭제된 경우 */
      if (code === ERROR_CODE.TOURNAMENT_NOT_FOUND) {
        router.replace(
          `${ROUTES.HOME}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.TOURNAMENT_NOT_FOUND}`
        );
        return;
      }

      /**
       * 400: 이미지 개수/형식/크기 초과·아이템 32개 초과
       * 403: 토너먼트 참여 권한 없음
       */
      toast.error(getApiErrorMessage(error));

      if (getApiErrorStatus(error) === 403) router.replace(ROUTES.HOME);
    },
  });

  return { postTournamentOCRMutation, isPostTournamentOCRPending, resetPostTournamentOCRMutation };
};
