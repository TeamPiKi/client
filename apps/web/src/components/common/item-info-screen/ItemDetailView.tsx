import Image from 'next/image';

import Spacing from '@/components/spacing';

import ItemInfoCard from './ItemInfoCard';
import ItemLinkBanner from './ItemLinkBanner';
import ItemMemoCard from './ItemMemoCard';
import type { PriceRefreshT, ReadyItemInfoT } from './itemInfoScreen.const';

type ItemDetailViewProps = {
  item: ReadyItemInfoT;
  hasMemo: boolean;
  priceRefresh?: PriceRefreshT;
  onEdit: () => void;
};

/** 정보를 정상적으로 가져온 상품의 조회 화면 */
function ItemDetailView({ item, hasMemo, priceRefresh, onEdit }: ItemDetailViewProps) {
  return (
    <>
      <div className="relative mt-5 aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        <Image src={item.imageUrl} alt="상품 이미지" fill sizes="440px" className="object-cover" />
        {item.sourceUrl && <ItemLinkBanner href={item.sourceUrl} />}
      </div>

      <Spacing size={12} />

      <ItemInfoCard
        name={item.name}
        price={item.price}
        priceRefresh={priceRefresh}
        onEdit={onEdit}
      />

      {hasMemo && (
        <>
          <Spacing size={12} />
          <ItemMemoCard />
        </>
      )}
    </>
  );
}

export default ItemDetailView;
