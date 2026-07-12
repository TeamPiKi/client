import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { postTournamentOCR } from '@/apis/postTournamentOCR';
import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';

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
      if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

      const {
        status,
        data: { detail },
      } = error.response;

      const clientErrorMessage = detail ?? '요청을 처리하지 못했습니다.';

      /**
       * 400: 이미지 개수/형식/크기 초과
       * 403: 토너먼트 참여 권한 없음
       * 404: 토너먼트 존재하지 않음
       * 409: PENDING 상태 아닌 토너먼트
       */
      if (status === 400) toast.error(clientErrorMessage);
      else if (status === 403 || status === 404 || status === 409) {
        toast.error(clientErrorMessage);
        router.replace(ROUTES.HOME);
      }
    },
  });

  return { postTournamentOCRMutation, isPostTournamentOCRPending, resetPostTournamentOCRMutation };
};
