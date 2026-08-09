'use client';

import { TrashIconOutline } from '@/assets/icons';
import ItemInfoScreen from '@/components/common/item-info-screen';
import { Header, HeaderIcon } from '@/components/header';

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
  const { postWishRefreshMutation, isPostWishRefreshPending } = usePostWishRefresh(wishId);

  return (
    <div className="to-bg-gray-50 hide-scrollbar min-h-dvh overflow-y-auto bg-linear-to-b from-bg-layer-default px-5 pt-padding-top pb-[78px]">
      <Header
        left={<HeaderIcon name="BACK" />}
        center="위시 정보"
        centerClassName="heading-1-bold"
        right={
          <button type="button" className="size-6">
            <TrashIconOutline className="size-6 text-icon-neutral-secondary" />
          </button>
        }
      />
      <main>
        <ItemInfoScreen
          itemStatus={wishData.item.status}
          initialImageUrl={wishData.item.imageUrl}
          initialName={wishData.item.name ?? ''}
          initialPrice={wishData.item.price ?? 0}
          sourceUrl={wishData.item.sourceUrl}
          onSave={data => patchWishMutation(data)}
          isSavePending={isPatchWishPending}
          onDelete={() => deleteWishMutation()}
          isDeletePending={isDeleteWishPending}
          onRefresh={() => postWishRefreshMutation()}
          isRefreshPending={isPostWishRefreshPending}
        />
      </main>
    </div>
  );
}

export default WishInfoScreen;
