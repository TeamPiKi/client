'use client';

import ItemInfoScreen from '@/components/common/item-info-screen';

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

  return (
    <ItemInfoScreen
      itemType="wish"
      item={{
        status: item.status,
        imageUrl: item.imageUrl,
        name: item.name ?? '',
        price: item.price ?? 0,
        sourceUrl: item.sourceUrl,
      }}
      onSave={data => patchWishMutation(data)}
      isSavePending={isPatchWishPending}
      onDelete={() => deleteWishMutation()}
      isDeletePending={isDeleteWishPending}
      memo={{ value: wishData.memo ?? '', save: memo => patchWishMutation({ memo }) }}
      {...(canRefresh && {
        priceRefresh: {
          refresh: () => postWishRefreshMutation(),
          isPending: isPostWishRefreshPending,
          isFailed: isPostWishRefreshFailed,
          closeFailedDialog: closePostWishRefreshFailed,
        },
      })}
    />
  );
}

export default WishInfoScreen;
