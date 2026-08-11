import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { ITEM_STATUS } from '@/consts/item';
import { isGlobalNetError } from '@/utils/apiError';

import { postWishRefresh } from '../_apis/postWishRefresh';
import type { GetWishResponseT } from '../_types/wish';

type WishItemT = GetWishResponseT['item'];

/** 갱신은 서버에서 비동기로 진행되고 완료는 SSE 가 알려주므로, 로딩·성패를 응답에 상품 정보가 실렸는지로 판단한다 */
export const usePostWishRefresh = (wishId: number, item: WishItemT) => {
  const queryClient = useQueryClient();
  const [isPostWishRefreshFailed, setIsPostWishRefreshFailed] = useState(false);
  const [isRefreshRequested, setIsRefreshRequested] = useState(false);
  const [itemBeforeRefresh, setItemBeforeRefresh] = useState<WishItemT | null>(null);

  const isItemFailed = item.status === ITEM_STATUS.FAILED;
  /** 갱신 중에는 상품 정보가 빈 응답으로 온다 */
  const isItemLoading = !item.imageUrl && !isItemFailed;

  const { mutate: postWishRefreshMutation, isPending: isPostWishRefreshPending } = useMutation({
    mutationFn: () => postWishRefresh(wishId),
    onSuccess: async () => {
      /** PROCESSING 을 받을 때까지 pending 을 유지해 로딩이 끊기지 않게 한다 */
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
    setItemBeforeRefresh(item);
    postWishRefreshMutation();
  };

  return {
    /** 갱신 직전 정보로 화면을 유지한다 */
    wishItem: item.imageUrl ? item : (itemBeforeRefresh ?? item),
    refreshWish,
    isPostWishRefreshPending: isPostWishRefreshPending || isItemLoading,
    /** 원래 실패해 있던 위시와 구분해, 갱신으로 실패한 경우만 안내한다 */
    isPostWishRefreshFailed: isPostWishRefreshFailed || (isRefreshRequested && isItemFailed),
    closePostWishRefreshFailed: () => {
      setIsPostWishRefreshFailed(false);
      setIsRefreshRequested(false);
    },
  };
};
