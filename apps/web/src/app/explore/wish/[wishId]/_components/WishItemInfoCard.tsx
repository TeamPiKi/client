import { HeartIconFill } from '@/assets/icons';
import formatPrice from '@/utils/formatPrice';

type WishItemInfoCardProps = {
  name: string;
  price: number;
  discountRate: number | null;
  savedCount: number;
};

function WishItemInfoCard({ name, price, discountRate, savedCount }: WishItemInfoCardProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl bg-bg-layer-floating p-4">
      <p className="flex items-center gap-1 rounded-3xl bg-gray-50 py-2 pr-2.5 pl-2 caption-1-medium text-text-neutral-secondary">
        <HeartIconFill className="size-[18px] text-icon-neutral-secondary" aria-hidden />
        {savedCount}명이 담은 상품
      </p>
      <div className="flex flex-col gap-2">
        <h2 className="line-clamp-2 body-1-medium break-keep text-text-neutral-primary">{name}</h2>
        <p className="flex gap-1 heading-2-semibold">
          {!!discountRate && <span className="text-text-accent">{discountRate}%</span>}
          <span className="text-text-neutral-primary">{formatPrice(String(price))}</span>
        </p>
      </div>
    </div>
  );
}

export default WishItemInfoCard;
