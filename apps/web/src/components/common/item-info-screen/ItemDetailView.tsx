import Image from 'next/image';

import Spacing from '@/components/spacing';

import ItemInfoCard from './ItemInfoCard';
import ItemLinkBanner from './ItemLinkBanner';
import ItemMemoCard from './ItemMemoCard';

type ItemDetailViewProps = {
  /** READY 응답은 이미지를 항상 포함한다 */
  imageUrl: string;
  name: string;
  price: number;
  /** 링크로 담은 경우에만 — 이미지 위 원본 링크 칩 */
  sourceUrl?: string | null;
  /** 메모를 지원하는 화면에서만 노출 */
  hasMemo?: boolean;
  onRefresh?: () => void;
  isRefreshPending?: boolean;
  onEdit: () => void;
};

/** 정보를 정상적으로 가져온 상품의 조회 화면 */
function ItemDetailView({
  imageUrl,
  name,
  price,
  sourceUrl,
  hasMemo = false,
  onRefresh,
  isRefreshPending,
  onEdit,
}: ItemDetailViewProps) {
  return (
    <>
      <div className="relative mt-7 aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        <Image src={imageUrl} alt="상품 이미지" fill sizes="440px" className="object-cover" />
        {sourceUrl && <ItemLinkBanner href={sourceUrl} />}
      </div>

      <Spacing size={12} />

      <ItemInfoCard
        name={name}
        price={price}
        onRefresh={onRefresh}
        isRefreshPending={isRefreshPending}
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
