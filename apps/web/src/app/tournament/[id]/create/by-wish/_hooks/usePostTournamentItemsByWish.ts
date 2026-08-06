import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postTournamentItemsByWish } from '../_apis/postTournamentItemsByWish';

export const usePostTournamentItemsByWish = (tournamentId: number) => {
  const backWithFallback = useBackWithFallback();
  const queryClient = useQueryClient();

  const {
    mutate: postTournamentItemsByWishMutation,
    isPending: isPostTournamentItemsByWishPending,
  } = useMutation({
    mutationFn: (itemIds: number[]) => postTournamentItemsByWish(tournamentId, { itemIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });

      sessionStorage.setItem(`piki:scrollToLast:${tournamentId}`, '1');
      backWithFallback(ROUTES.TOURNAMENT_CREATE(tournamentId));
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      /**
       * 400: 아이템 32개 초과
       * 403: 토너먼트 참여 권한 없음·위시에 없는 아이템
       * 404: 토너먼트 or 아이템 존재하지 않음
       * 409: 이미 담은 아이템·아직 추출 중인 상품
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { postTournamentItemsByWishMutation, isPostTournamentItemsByWishPending };
};
