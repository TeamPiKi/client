'use client';

import { Header, HeaderIcon } from '@/components/header';
import ItemLinkBanner from '@/components/common/item-link-banner';

import { useGetWish } from '../_hooks/useGetWish';
import ItemEditForm from './ItemEditForm';

type EditContentProps = {
  wishId: number;
};

function EditContent({ wishId }: EditContentProps) {
  const { wishData } = useGetWish(wishId);

  return (
    <div className="hide-scrollbar min-h-dvh overflow-y-auto bg-bg-layer-basement px-5 pt-padding-top pb-[78px]">
      <Header
        left={<HeaderIcon name="BACK" />}
        center="위시템 정보 확인"
        centerClassName="heading-1-bold"
      />
      <main>
        <ItemEditForm
          wishId={wishId}
          itemStatus={wishData.item.status}
          initialImageUrl={wishData.item.status === 'READY' ? wishData.item.imageUrl : null}
          initialName={wishData.item.status === 'READY' ? wishData.item.name : ''}
          initialPrice={wishData.item.status === 'READY' ? wishData.item.currentPrice : 0}
        />

        {wishData.item.sourceUrl && <ItemLinkBanner href={wishData.item.sourceUrl} />}
      </main>
    </div>
  );
}

export default EditContent;
