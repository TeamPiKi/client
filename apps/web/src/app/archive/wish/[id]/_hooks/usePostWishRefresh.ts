import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';

import { postWishRefresh } from '../_apis/postWishRefresh';

export const usePostWishRefresh = (wishId: number) => {
  const backWithFallback = useBackWithFallback();
  const queryClient = useQueryClient();

  const { mutate: postWishRefreshMutation, isPending: isPostWishRefreshPending } = useMutation({
    mutationFn: () => postWishRefresh(wishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wish', wishId] });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      backWithFallback(ROUTES.WISHLIST);
    },
  });

  return { postWishRefreshMutation, isPostWishRefreshPending };
};
