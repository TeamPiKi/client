import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
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
      toast.error(getApiErrorMessage(error));
    },
  });

  return { postTournamentItemsByWishMutation, isPostTournamentItemsByWishPending };
};
