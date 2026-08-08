'use client';

import ItemEditFormBase from '@/components/common/item-edit-form';
import type { ItemStatusT } from '@/types/item';

import { useDeleteWish } from '../_hooks/useDeleteWish';
import { usePatchWish } from '../_hooks/usePatchWish';
import { usePostWishRefresh } from '../_hooks/usePostWishRefresh';

type ItemEditFormProps = {
  wishId: number;
  itemStatus: ItemStatusT;
  initialImageUrl: string | null;
  initialName: string;
  initialPrice: number;
  sourceUrl: string | null;
};

function ItemEditForm({
  wishId,
  itemStatus,
  initialImageUrl,
  initialName,
  initialPrice,
  sourceUrl,
}: ItemEditFormProps) {
  const { patchWishMutation, isPatchWishPending } = usePatchWish(wishId);
  const { deleteWishMutation, isDeleteWishPending } = useDeleteWish(wishId);
  const { postWishRefreshMutation, isPostWishRefreshPending } = usePostWishRefresh(wishId);

  return (
    <ItemEditFormBase
      itemStatus={itemStatus}
      initialImageUrl={initialImageUrl}
      initialName={initialName}
      initialPrice={initialPrice}
      sourceUrl={sourceUrl}
      onSave={data => patchWishMutation(data)}
      isSavePending={isPatchWishPending}
      onDelete={() => deleteWishMutation()}
      isDeletePending={isDeleteWishPending}
      onRefresh={() => postWishRefreshMutation()}
      isRefreshPending={isPostWishRefreshPending}
    />
  );
}

export default ItemEditForm;
