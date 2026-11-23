import ImageIconOutline from '@/assets/icons/outline/image.svg';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';
import formatPrice from '@/utils/formatPrice';

import type { FriendWishT } from '../_types/explore';

type FriendWishCardProps = {
  item: FriendWishT['item'];
  friend: FriendWishT['friend'];
  /** scroll: 가로 스크롤 섹션용 작은 카드 · grid: 2열 목록용 카드 */
  variant: 'scroll' | 'grid';
  preload?: boolean;
};

const VARIANT_STYLE = {
  scroll: {
    image: 'aspect-[133/140] overflow-hidden rounded-lg',
    friend: 'inset-x-[11px] bottom-2.5',
    profile: 'size-5',
    info: 'p-2',
    name: 'truncate',
    sizes: '133px',
  },
  grid: {
    image: 'aspect-square',
    friend: 'inset-x-3.5 bottom-[13px]',
    profile: 'size-4.5',
    info: 'px-3 py-2',
    name: 'line-clamp-2',
    sizes: '(max-width: 480px) 50vw, 240px',
  },
} as const;

function FriendWishCard({ item, friend, variant, preload = false }: FriendWishCardProps) {
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
        <div
          className="absolute inset-0 bg-linear-to-b from-transparent to-black/20"
          style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
        >
          <div className={cn('absolute flex items-center gap-2', style.friend)}>
            <span className={cn('relative shrink-0 overflow-hidden rounded-full', style.profile)}>
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

      <div className={cn('flex flex-col gap-0.5', style.info)}>
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
    </div>
  );
}

export default FriendWishCard;
