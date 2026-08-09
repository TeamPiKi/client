import { EditIconFill, TagIconFill } from '@/assets/icons';
import Spacing from '@/components/spacing';
import Spinner from '@/components/spinner';
import formatPrice from '@/utils/formatPrice';

import type { PriceRefreshT } from './itemInfoScreen.type';

type ItemInfoCardProps = {
  name: string;
  price: number;
  /** 링크로 담은 상품에만 전달 — 없으면 새로고침 버튼을 노출하지 않는다 */
  priceRefresh?: PriceRefreshT;
  onEdit: () => void;
};

/** 상품명·가격과 액션 버튼을 담은 카드. 가격 정보를 불러오는 동안에는 로딩만 보여준다 */
function ItemInfoCard({ name, price, priceRefresh, onEdit }: ItemInfoCardProps) {
  if (priceRefresh?.isPending) {
    return (
      <div className="flex min-h-[174px] items-center justify-center rounded-xl bg-bg-layer-floating p-4">
        <Spinner size={28} color="var(--color-icon-accent)" />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-bg-layer-floating p-4">
      <h2 className="line-clamp-2 body-1-medium break-keep text-text-neutral-primary">{name}</h2>

      <Spacing size={8} />

      <p className="heading-2-semibold text-text-neutral-primary">{formatPrice(String(price))}</p>

      <Spacing size={16} />

      <div className="flex gap-2">
        {priceRefresh && (
          <button
            type="button"
            onClick={priceRefresh.refresh}
            className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-bg-accent/8 body-2-medium text-text-neutral-primary"
          >
            <TagIconFill className="size-4 text-icon-accent" />
            가격 정보 새로고침
          </button>
        )}

        <button
          type="button"
          onClick={onEdit}
          className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl bg-gray-50 body-2-medium text-text-neutral-primary"
        >
          <EditIconFill className="size-4 text-icon-neutral-primary" />
          상품 정보 수정
        </button>
      </div>
    </div>
  );
}

export default ItemInfoCard;
