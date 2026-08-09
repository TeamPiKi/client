'use client';

import ItemInfoScreen from '@/components/common/item-info-screen';
import { ITEM_STATUS } from '@/consts/item';

import { useDeleteWish } from '../_hooks/useDeleteWish';
import { useGetWish } from '../_hooks/useGetWish';
import { usePatchWish } from '../_hooks/usePatchWish';
import { usePostWishRefresh } from '../_hooks/usePostWishRefresh';

type WishInfoScreenProps = {
  wishId: number;
};

function WishInfoScreen({ wishId }: WishInfoScreenProps) {
  const { wishData } = useGetWish(wishId);
  const { patchWishMutation, isPatchWishPending } = usePatchWish(wishId);
  const { deleteWishMutation, isDeleteWishPending } = useDeleteWish(wishId);
  const {
    postWishRefreshMutation,
    isPostWishRefreshPending,
    isPostWishRefreshFailed,
    closePostWishRefreshFailed,
  } = usePostWishRefresh(wishId);

  const { item } = wishData;

  /** 이미지로 담은 위시는 다시 불러올 원본 링크가 없다 */
  const canRefresh = wishData.refreshNeeded !== null;

  /** READY 만 이미지·상품명·가격이 모두 채워져 있다 */
  const itemProps =
    item.status === ITEM_STATUS.READY
      ? {
          itemStatus: item.status,
          imageUrl: item.imageUrl,
          name: item.name,
          price: item.price,
        }
      : {
          itemStatus: item.status,
          imageUrl: item.imageUrl,
          name: item.name ?? '',
          price: item.price ?? 0,
        };

  return (
    <ItemInfoScreen
      {...itemProps}
      sourceUrl={item.sourceUrl}
      hasMemo
      onSave={data => patchWishMutation(data)}
      isSavePending={isPatchWishPending}
      onDelete={() => deleteWishMutation()}
      isDeletePending={isDeleteWishPending}
      {...(canRefresh && {
        onRefresh: () => postWishRefreshMutation(),
        isRefreshPending: isPostWishRefreshPending,
        isRefreshFailed: isPostWishRefreshFailed,
        onRefreshFailedClose: closePostWishRefreshFailed,
      })}
    />
  );
}

export default WishInfoScreen;
