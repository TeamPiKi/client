import type { ReactNode } from 'react';

import { BadgeIconFill, WarningIconFill } from '@/assets/icons';
import ImageIconOutline from '@/assets/icons/outline/image.svg';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import Spinner from '@/components/spinner';
import { ITEM_STATUS } from '@/consts/item';
import { Z_INDEX } from '@/consts/zIndex';
import type { ItemStatusT } from '@/types/item';
import formatPrice from '@/utils/formatPrice';

type WishCardProps = {
  status: ItemStatusT;
  name: string | null;
  price: number | null;
  imageUrl: string | null;
  sourcePlatform: string | null;
  discountRate?: number | null;
  /** 내가 플레이한 토너먼트에서 우승한 적 있는지 */
  isWinner?: boolean;
  preload?: boolean;
};

const imageFallback = (
  <div className="absolute inset-0 flex items-center justify-center text-gray-200">
    <ImageIconOutline width={32} height={32} />
  </div>
);

const STATUS_CARD_CONTENT: Record<
  ItemStatusT<'PARSING' | 'INCOMPLETE' | 'FAILED'>,
  { thumbnail: ReactNode; title: string; description?: string }
> = {
  [ITEM_STATUS.PARSING]: {
    thumbnail: <Spinner size={40} />,
    title: '상품을 담고 있어요.',
  },
  [ITEM_STATUS.INCOMPLETE]: {
    thumbnail: <WarningIconFill className="size-10 text-icon-warning" aria-hidden />,
    title: '일부 정보만 가져왔어요',
    description: '직접 수정할 수 있어요.',
  },
  [ITEM_STATUS.FAILED]: {
    thumbnail: <WarningIconFill className="size-10 text-icon-error" aria-hidden />,
    title: '불러오기에 실패했어요',
    description: '직접 입력해 주세요.',
  },
};

/** 3열 그리드용 위시 카드 */
function WishCard({
  status,
  name,
  price,
  imageUrl,
  sourcePlatform,
  discountRate = null,
  isWinner = false,
  preload = false,
}: WishCardProps) {
  if (status !== ITEM_STATUS.READY) {
    const { thumbnail, title, description } = STATUS_CARD_CONTENT[status];

    return (
      <div className="flex flex-col">
        <div className="flex aspect-[133/140] w-full items-center justify-center bg-gray-75">
          {thumbnail}
        </div>
        <div className="flex flex-col gap-1 p-3">
          <p className="caption-1-semibold text-text-neutral-primary">{title}</p>
          {description && (
            <p className="caption-1-regular text-text-neutral-secondary">{description}</p>
          )}
        </div>
      </div>
    );
  }

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
            {!!discountRate && <span className="text-bg-accent">{discountRate}%</span>}
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
