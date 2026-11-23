import formatPrice from '@/utils/formatPrice';

type WishItemInfoCardProps = {
  name: string;
  price: number;
  discountRate: number | null;
  savedCount: number;
};

function WishItemInfoCard({ name, price, discountRate, savedCount }: WishItemInfoCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-bg-layer-floating p-4">
      <p className="caption-1-regular text-text-accent">{savedCount}명이 담은 상품</p>
      <h2 className="line-clamp-2 body-1-medium break-keep text-text-neutral-primary">{name}</h2>
      <p className="flex gap-1 heading-2-semibold">
        {!!discountRate && <span className="text-text-accent">{discountRate}%</span>}
        <span className="text-text-neutral-primary">{formatPrice(String(price))}</span>
      </p>
    </div>
  );
}

export default WishItemInfoCard;
