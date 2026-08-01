import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postTournamentItemLink } from '../_apis/postTournamentItemLink';

export const usePostTournamentItemLink = (tournamentId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: postTournamentItemLinkMutation, isPending: isPostTournamentItemLinkPending } =
    useMutation({
      mutationFn: (url: string) => postTournamentItemLink(tournamentId, url),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      },
      onError: error => {
        if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

        const { status } = error.response;

        if (status === 401 || status >= 500) return;

        /**
         * 400: 링크 형식 오류·미지원 쇼핑몰·아이템 32개 초과
         * 403: 토너먼트 참여 권한 없음
         * 404: 토너먼트 존재하지 않음
         * 409: PENDING 상태 아닌 토너먼트
         */
        toast.error(getApiErrorMessage(error));

        if (status === 403 || status === 404 || status === 409) router.replace(ROUTES.HOME);
      },
    });

  return { postTournamentItemLinkMutation, isPostTournamentItemLinkPending };
};
