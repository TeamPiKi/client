import ImageIconOutline from '@/assets/icons/outline/image.svg';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import formatPrice from '@/utils/formatPrice';

import WinnerChip from '../_common/_components/WinnerChip';
import type { WinnerWishT } from '../_common/_types/explore';

type WinnerWishThumbnailCardProps = {
  item: WinnerWishT['item'];
  preload?: boolean;
};

function WinnerWishThumbnailCard({ item, preload = false }: WinnerWishThumbnailCardProps) {
  const imageFallback = (
    <div className="absolute inset-0 flex items-center justify-center text-gray-200">
      <ImageIconOutline width={32} height={32} />
    </div>
  );

  return (
    <div className="flex flex-col">
      <div className="relative aspect-[133/140] w-full overflow-hidden rounded-lg bg-gray-75">
        {item.imageUrl ? (
          <BaseImage
            src={item.imageUrl}
            alt={item.name}
            sizes="133px"
            preload={preload}
            loadingFallback={<Skeleton className="absolute inset-0 rounded-none" />}
            errorFallback={imageFallback}
            className="object-cover"
          />
        ) : (
          imageFallback
        )}
        <WinnerChip
          className="absolute bottom-0 left-0 rounded-bl-lg"
          style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
        />
      </div>

      <div className="flex flex-col gap-0.5 p-2">
        <p className="truncate caption-1-semibold text-text-neutral-primary">{item.name}</p>
        <p className="flex gap-1 body-2-semibold">
          {!!item.discountRate && <span className="text-bg-accent">{item.discountRate}%</span>}
          <span className="truncate text-text-neutral-primary">
            {formatPrice(String(item.price ?? ''))}
          </span>
        </p>
      </div>
    </div>
  );
}

export default WinnerWishThumbnailCard;
