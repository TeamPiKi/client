import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { isGlobalNetError } from '@/utils/apiError';

import { postWishRefresh } from '../_apis/postWishRefresh';

/**
 * 위시 가격 정보 갱신
 *
 * 실패 안내는 토스트 대신 전용 다이얼로그(`PriceRefreshFailedDialog`)가 맡으므로,
 * 전역이 가져가지 않는 에러는 모두 `isPostWishRefreshFailed` 로 올린다.
 */
export const usePostWishRefresh = (wishId: number) => {
  const queryClient = useQueryClient();
  const [isPostWishRefreshFailed, setIsPostWishRefreshFailed] = useState(false);

  const { mutate: postWishRefreshMutation, isPending: isPostWishRefreshPending } = useMutation({
    mutationFn: () => postWishRefresh(wishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wish', wishId] });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      setIsPostWishRefreshFailed(true);
    },
  });

  return {
    postWishRefreshMutation,
    isPostWishRefreshPending,
    isPostWishRefreshFailed,
    closePostWishRefreshFailed: () => setIsPostWishRefreshFailed(false),
  };
};
