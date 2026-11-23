import ImageIconOutline from '@/assets/icons/outline/image.svg';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import formatPrice from '@/utils/formatPrice';

import type { FriendWishT } from '../_common/_types/explore';

type FriendWishThumbnailCardProps = {
  item: FriendWishT['item'];
  friend: FriendWishT['friend'];
  preload?: boolean;
};

function FriendWishThumbnailCard({ item, friend, preload = false }: FriendWishThumbnailCardProps) {
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
        <div
          className="absolute inset-0 bg-linear-to-b from-transparent to-black/20"
          style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
        >
          <div className="absolute inset-x-[11px] bottom-2.5 flex items-center gap-2">
            <span className="relative size-5 shrink-0 overflow-hidden rounded-full">
              <BaseImage
                src={friend.profileImage}
                alt=""
                sizes="20px"
                className="object-cover"
                loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-[0.4px] rounded-full border-[1.6px] border-white"
                style={{ zIndex: Z_INDEX.BASE_IMAGE }}
              />
            </span>
            <span className="truncate caption-1-semibold text-text-neutral-inverse">
              {friend.nickname}
            </span>
          </div>
        </div>
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

export default FriendWishThumbnailCard;
