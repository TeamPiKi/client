'use client';

import { TrashIconOutline } from '@/assets/icons';
import ItemLinkBanner from '@/components/common/item-edit-form/ItemLinkBanner';
import { Header, HeaderIcon } from '@/components/header';

import { useGetWish } from '../_hooks/useGetWish';
import ItemEditForm from './ItemEditForm';

type EditContentProps = {
  wishId: number;
};

function EditContent({ wishId }: EditContentProps) {
  const { wishData } = useGetWish(wishId);

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
        <ItemEditForm
          wishId={wishId}
          itemStatus={wishData.item.status}
          initialImageUrl={wishData.item.imageUrl}
          initialName={wishData.item.name ?? ''}
          initialPrice={wishData.item.price ?? 0}
          sourceUrl={wishData.item.sourceUrl}
        />

        {wishData.item.sourceUrl && <ItemLinkBanner href={wishData.item.sourceUrl} />}
      </main>
    </div>
  );
}

export default EditContent;
