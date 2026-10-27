import { BadgeIconFill } from '@/assets/icons';
import ImageIconOutline from '@/assets/icons/outline/image.svg';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import formatPrice from '@/utils/formatPrice';

type WishCardProps = {
  name: string | null;
  price: number | null;
  imageUrl: string | null;
  sourcePlatform: string | null;
  discountRate: number | null;
  /** 내가 플레이한 토너먼트에서 우승한 적 있는지 */
  isWinner?: boolean;
  preload?: boolean;
};

const imageFallback = (
  <div className="absolute inset-0 flex items-center justify-center text-gray-200">
    <ImageIconOutline width={32} height={32} />
  </div>
);

/** 3열 그리드용 위시 카드 */
function WishCard({
  name,
  price,
  imageUrl,
  sourcePlatform,
  discountRate,
  isWinner = false,
  preload = false,
}: WishCardProps) {
  return (
    <div className="flex flex-col">
      <div className="relative aspect-[133/140] w-full bg-gray-75">
        {imageUrl ? (
          <BaseImage
            src={imageUrl}
            alt={name ?? ''}
            sizes="(max-width: 480px) 34vw, 160px"
            preload={preload}
            loadingFallback={<Skeleton className="absolute inset-0 rounded-none" />}
            errorFallback={imageFallback}
            className="object-cover"
          />
        ) : (
          imageFallback
        )}
        {isWinner && (
          <span
            style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
            className="absolute bottom-0 left-0 flex items-center gap-0.5 bg-bg-neutral-primary py-0.5 pr-1.5 pl-1 caption-2-medium text-text-neutral-inverse"
          >
            <BadgeIconFill className="size-3" />
            1위
          </span>
        )}
      </div>

      <div className="flex h-[120px] flex-col items-start gap-2 p-3">
        <div className="flex w-full flex-col gap-1">
          <p className="line-clamp-2 caption-1-semibold whitespace-pre-line text-text-neutral-primary">
            {name}
          </p>
          <p className="flex gap-1 body-2-semibold">
            {discountRate !== null && <span className="text-bg-accent">{discountRate}%</span>}
            <span className="truncate text-text-neutral-primary">{formatPrice(String(price))}</span>
          </p>
        </div>
        {sourcePlatform && (
          <span className="rounded-[3px] bg-gray-75 px-1 caption-1-regular text-text-neutral-secondary">
            {sourcePlatform}
          </span>
        )}
      </div>
    </div>
  );
}

export default WishCard;
