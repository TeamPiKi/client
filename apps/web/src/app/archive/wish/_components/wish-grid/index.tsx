import Link from 'next/link';
import type { MouseEvent } from 'react';

import { CheckboxEmptyIconFill, CheckboxSelectedIconFill } from '@/assets/icons';
import WishCard from '@/components/common/wish-card';
import { ROUTES } from '@/consts/route';
import type { WishItemT } from '@/types/wish';

import { saveWishScroll } from '../../_utils/wishScroll';
import WishFailedCard from './WishFailedCard';
import WishProcessingCard from './WishProcessingCard';

type WishGridProps = {
  items: WishItemT[];
  isDeleteMode?: boolean;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
};

function WishGrid({ items, isDeleteMode = false, selectedIds, onToggleSelect }: WishGridProps) {
  const handleCardClick = (event: MouseEvent<HTMLAnchorElement>, wishId: number) => {
    /** 새 탭/새 창 열기는 현재 페이지를 떠나지 않으므로 스크롤 위치를 저장하지 않는다. */
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    saveWishScroll(event.currentTarget, wishId);
  };

  return (
    <div className="grid grid-cols-2">
      {items.map((item, index) => {
        if (item.status === 'FAILED')
          return (
            <Link
              href={ROUTES.WISH_EDIT(item.id)}
              key={item.id}
              data-wish-id={item.id}
              onClick={event => handleCardClick(event, item.id)}
            >
              <WishFailedCard key={item.id} />
            </Link>
          );
        else if (item.status === 'PENDING' || item.status === 'PROCESSING')
          return <WishProcessingCard key={item.id} />;

        if (isDeleteMode) {
          const isSelected = selectedIds?.has(item.id) ?? false;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleSelect?.(item.id)}
              aria-pressed={isSelected}
              className="relative cursor-pointer text-left transition-opacity active:opacity-80"
            >
              <WishCard
                name={item.name}
                price={item.price}
                imageUrl={item.imageUrl}
                sourcePlatform={item.sourcePlatform}
              />
              <div
                className={`pointer-events-none absolute top-0 right-0 left-0 z-[11] aspect-[201/166] bg-black/20 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
              />
              <span className="pointer-events-none absolute top-3 left-3 z-[12] block size-5">
                {isSelected ? (
                  <CheckboxSelectedIconFill className="size-5 text-bg-accent" />
                ) : (
                  <CheckboxEmptyIconFill className="size-5 text-black/8" />
                )}
              </span>
            </button>
          );
        }

        return (
          <Link
            href={ROUTES.WISH_EDIT(item.id)}
            key={item.id}
            data-wish-id={item.id}
            onClick={event => handleCardClick(event, item.id)}
          >
            <WishCard
              name={item.name}
              price={item.price}
              imageUrl={item.imageUrl}
              sourcePlatform={item.sourcePlatform}
              preload={index < 4}
            />
          </Link>
        );
      })}
    </div>
  );
}

export default WishGrid;
