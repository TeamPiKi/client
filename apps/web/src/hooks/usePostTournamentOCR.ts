import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { postTournamentOCR } from '@/apis/postTournamentOCR';
import { ROUTES } from '@/consts/route';
import { getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
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

      /**
       * 400: 이미지 개수/형식/크기 초과·아이템 32개 초과
       * 403: 토너먼트 참여 권한 없음
       * 404: 토너먼트 존재하지 않음
       * 409: PENDING 상태 아닌 토너먼트
       */
      toast.error(getApiErrorMessage(error));

      const status = getApiErrorStatus(error);
      if (status === 403 || status === 404 || status === 409) router.replace(ROUTES.HOME);
    },
  });

  return { postTournamentOCRMutation, isPostTournamentOCRPending, resetPostTournamentOCRMutation };
};
