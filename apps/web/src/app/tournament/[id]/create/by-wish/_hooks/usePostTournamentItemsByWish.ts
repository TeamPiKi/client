import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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

      sessionStorage.setItem(`piki:scrollToLast:${tournamentId}`, '1');
      router.back();
    },
    onError: error => {
      toast.error(getApiErrorMessage(error));
    },
  });

  return { postTournamentItemsByWishMutation, isPostTournamentItemsByWishPending };
};
