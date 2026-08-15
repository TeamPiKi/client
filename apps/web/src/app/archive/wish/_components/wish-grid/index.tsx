import Link from 'next/link';
import type { MouseEvent } from 'react';

import { CheckboxEmptyIconFill, CheckboxSelectedIconFill } from '@/assets/icons';
import WishCard from '@/components/common/wish-card';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import type { GetWishlistResponseT } from '@/types/wish';
import { SCROLL_NAMESPACE, saveScrollAnchor } from '@/utils/scrollRestoration';

import WishFailedCard from './WishFailedCard';
import WishProcessingCard from './WishProcessingCard';

type WishGridProps = {
  items: GetWishlistResponseT[];
  isDeleteMode?: boolean;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
};

function WishGrid({ items, isDeleteMode = false, selectedIds, onToggleSelect }: WishGridProps) {
  const handleCardClick = (event: MouseEvent<HTMLAnchorElement>, wishId: number) => {
    /** 새 탭/새 창 열기는 현재 페이지를 떠나지 않으므로 스크롤 위치를 저장하지 않는다. */
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    saveScrollAnchor({ namespace: SCROLL_NAMESPACE.ARCHIVE_WISH }, event.currentTarget, wishId);
  };

  return (
    <div className="grid grid-cols-2">
      {items.map(({ wish, item }, index) => {
        if (item.status === 'FAILED' || item.status === 'INCOMPLETE')
          return (
            <Link
              href={ROUTES.WISH_EDIT(wish.id)}
              key={wish.id}
              data-scroll-anchor-id={wish.id}
              onClick={event => handleCardClick(event, wish.id)}
            >
              <WishFailedCard
                message={
                  item.status === 'INCOMPLETE' ? '일부만 가져왔어요' : '가져오는데 실패했어요'
                }
              />
            </Link>
          );
        else if (item.status === 'PENDING' || item.status === 'PROCESSING')
          return <WishProcessingCard key={wish.id} />;

        if (isDeleteMode) {
          const isSelected = selectedIds?.has(wish.id) ?? false;
          return (
            <button
              key={wish.id}
              type="button"
              onClick={() => onToggleSelect?.(wish.id)}
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
                style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
                className={`pointer-events-none absolute top-0 right-0 left-0 aspect-[201/166] bg-black/20 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
              />
              <span
                style={{ zIndex: Z_INDEX.BASE_IMAGE + 2 }}
                className="pointer-events-none absolute top-3 left-3 block size-5"
              >
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
            href={ROUTES.WISH_EDIT(wish.id)}
            key={wish.id}
            data-scroll-anchor-id={wish.id}
            onClick={event => handleCardClick(event, wish.id)}
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
