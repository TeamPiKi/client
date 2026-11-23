import ImageIconOutline from '@/assets/icons/outline/image.svg';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';
import formatPrice from '@/utils/formatPrice';

import type { ExploreItemT } from '../_types/explore';
import WinnerChip from './WinnerChip';

type ExploreWishCardProps = {
  item: ExploreItemT;
  /** scroll: 가로 스크롤 섹션용 작은 카드 · grid: 2열 목록용 카드 */
  variant: 'scroll' | 'grid';
  isWinner?: boolean;
  /** 가격 아래 보조 문구 (토너먼트명 등) */
  caption?: string;
  preload?: boolean;
};

const VARIANT_STYLE = {
  scroll: {
    image: 'aspect-[133/140] overflow-hidden rounded-lg',
    chip: 'rounded-bl-lg',
    info: 'p-2',
    name: 'truncate',
    sizes: '133px',
  },
  grid: {
    image: 'aspect-square',
    chip: '',
    info: 'px-3 py-2',
    name: 'line-clamp-2',
    sizes: '(max-width: 480px) 50vw, 240px',
  },
} as const;

function ExploreWishCard({
  item,
  variant,
  isWinner = false,
  caption,
  preload = false,
}: ExploreWishCardProps) {
  const style = VARIANT_STYLE[variant];
  const imageFallback = (
    <div className="absolute inset-0 flex items-center justify-center text-gray-200">
      <ImageIconOutline width={32} height={32} />
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className={cn('relative w-full bg-gray-75', style.image)}>
        {item.imageUrl ? (
          <BaseImage
            src={item.imageUrl}
            alt={item.name}
            sizes={style.sizes}
            preload={preload}
            loadingFallback={<Skeleton className="absolute inset-0 rounded-none" />}
            errorFallback={imageFallback}
            className="object-cover"
          />
        ) : (
          imageFallback
        )}
        {isWinner && (
          <WinnerChip
            className={cn('absolute bottom-0 left-0', style.chip)}
            style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
          />
        )}
      </div>

      <div className={cn('flex flex-col gap-1', style.info)}>
        <div className="flex flex-col gap-0.5">
          <p className={cn('caption-1-semibold text-text-neutral-primary', style.name)}>
            {item.name}
          </p>
          <p className="flex gap-1 body-2-semibold">
            {!!item.discountRate && <span className="text-bg-accent">{item.discountRate}%</span>}
            <span className="truncate text-text-neutral-primary">
              {formatPrice(String(item.price ?? ''))}
            </span>
          </p>
        </div>
        {caption && (
          <p className="truncate caption-1-regular text-border-neutral-secondary">{caption}</p>
        )}
        {item.sourcePlatform && (
          <span className="self-start rounded-[3px] bg-gray-75 px-1 caption-1-regular text-text-neutral-secondary">
            {item.sourcePlatform}
          </span>
        )}
      </div>
    </div>
  );
}

export default ExploreWishCard;
