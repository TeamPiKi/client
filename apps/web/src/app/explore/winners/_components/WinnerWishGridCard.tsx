import ImageIconOutline from '@/assets/icons/outline/image.svg';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import formatPrice from '@/utils/formatPrice';

import WinnerChip from '../../_common/_components/WinnerChip';
import type { ExploreItemT } from '../../_common/_types/explore';

type WinnerWishGridCardProps = {
  item: ExploreItemT;
  isWinner?: boolean;
  /** 가격 아래 보조 문구 (토너먼트명 등) */
  caption?: string;
  preload?: boolean;
};

function WinnerWishGridCard({
  item,
  isWinner = false,
  caption,
  preload = false,
}: WinnerWishGridCardProps) {
  const imageFallback = (
    <div className="absolute inset-0 flex items-center justify-center text-gray-200">
      <ImageIconOutline width={32} height={32} />
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="relative aspect-square w-full bg-gray-75">
        {item.imageUrl ? (
          <BaseImage
            src={item.imageUrl}
            alt={item.name}
            sizes="(max-width: 480px) 50vw, 240px"
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
            className="absolute bottom-0 left-0"
            style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
          />
        )}
      </div>

      <div className="flex h-30 flex-col gap-1 px-3 py-2">
        <div className="flex flex-col gap-0.5">
          <p className="line-clamp-2 caption-1-semibold text-text-neutral-primary">{item.name}</p>
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

export default WinnerWishGridCard;
