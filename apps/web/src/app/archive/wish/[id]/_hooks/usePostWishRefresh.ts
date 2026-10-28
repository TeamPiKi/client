import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ITEM_STATUS } from '@/consts/item';
import { useSSEFallback } from '@/hooks/useSSEFallback';
import { isGlobalNetError } from '@/utils/apiError';

import { postWishRefresh } from '../_apis/postWishRefresh';
import type { GetWishResponseT } from '../_types/wish';

export const usePostWishRefresh = (wishId: number, item: GetWishResponseT['item']) => {
  const queryClient = useQueryClient();
  const [isPostWishRefreshFailed, setIsPostWishRefreshFailed] = useState(false);
  const [isRefreshRequested, setIsRefreshRequested] = useState(false);

  const isItemFailed = item.status === ITEM_STATUS.FAILED;

  useSSEFallback(['wish', wishId], item.refreshing);

  const { mutate: postWishRefreshMutation, isPending: isPostWishRefreshPending } = useMutation({
    mutationFn: () => postWishRefresh(wishId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['wish', wishId] });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      setIsPostWishRefreshFailed(true);
    },
  });

  const refreshWish = () => {
    setIsRefreshRequested(true);
    postWishRefreshMutation();
  };

  return {
    refreshWish,
    isPostWishRefreshPending: isPostWishRefreshPending || item.refreshing,
    /** 원래 실패해 있던 위시와 구분해, 갱신으로 실패한 경우만 안내한다 */
    isPostWishRefreshFailed: isPostWishRefreshFailed || (isRefreshRequested && isItemFailed),
    closePostWishRefreshFailed: () => {
      setIsPostWishRefreshFailed(false);
      setIsRefreshRequested(false);
    },
  };
};
