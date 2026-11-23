import ImageIconOutline from '@/assets/icons/outline/image.svg';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import formatPrice from '@/utils/formatPrice';

import type { FriendWishT } from '../../_common/_types/explore';

type FriendWishGridCardProps = {
  item: FriendWishT['item'];
  friend: FriendWishT['friend'];
  preload?: boolean;
};

function FriendWishGridCard({ item, friend, preload = false }: FriendWishGridCardProps) {
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
        <div
          className="absolute inset-0 bg-linear-to-b from-transparent to-black/20"
          style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
        >
          <div className="absolute inset-x-3.5 bottom-[13px] flex items-center gap-2">
            <span className="relative size-4.5 shrink-0 overflow-hidden rounded-full">
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

      <div className="flex h-30 flex-col gap-0.5 px-3 py-2">
        <p className="line-clamp-2 caption-1-semibold text-text-neutral-primary">{item.name}</p>
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

export default FriendWishGridCard;
