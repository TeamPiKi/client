import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postTournamentItemsByWish } from '../_apis/postTournamentItemsByWish';

export const usePostTournamentItemsByWish = (tournamentId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: postTournamentItemsByWishMutation,
    isPending: isPostTournamentItemsByWishPending,
  } = useMutation({
    mutationFn: (itemIds: number[]) => postTournamentItemsByWish(tournamentId, { itemIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      router.replace(
        `${ROUTES.TOURNAMENT_CREATE(tournamentId)}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.SCROLL_TO_LAST}`
      );
    },
    onError: error => {
      toast.error(getApiErrorMessage(error));
    },
  });

  return { postTournamentItemsByWishMutation, isPostTournamentItemsByWishPending };
};
