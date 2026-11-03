'use client';

import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';

import { CheckboxEmptyIconFill, CheckboxSelectedIconFill } from '@/assets/icons';
import { ITEM_STATUS } from '@/consts/item';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import type { GetWishlistResponseT } from '@/types/wish';
import type { ScrollRestorationTargetT } from '@/utils/scrollRestoration';
import { saveScrollAnchor } from '@/utils/scrollRestoration';

import WishCard from './WishCard';

type WishGridProps = {
  wishes: GetWishlistResponseT[];
  selectedWishIds?: Set<number>;
  onToggleSelect?: (wishId: number) => void;
  leadingItem?: ReactNode;
  scrollRestoration?: ScrollRestorationTargetT;
};

/** 이미지 preload 개수 */
const PRELOAD_COUNT = 6;

/** 위시 3열 그리드 **/
function WishGrid({
  wishes,
  selectedWishIds,
  onToggleSelect,
  leadingItem,
  scrollRestoration,
}: WishGridProps) {
  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, wishId: number) => {
    if (!scrollRestoration) return;

    /** 새 탭/새 창 열기는 현재 페이지를 떠나지 않으므로 스크롤 위치를 저장하지 않음 */
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    saveScrollAnchor(scrollRestoration, event.currentTarget, wishId);
  };

  return (
    <ul className="grid grid-cols-3 gap-x-[1.5px] gap-y-6">
      {leadingItem && <li>{leadingItem}</li>}
      {wishes.map(({ wish, item, winnerTournamentIds }, index) => {
        const card = (
          <WishCard
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            sourcePlatform={item.sourcePlatform}
            isWinner={winnerTournamentIds.length > 0}
            preload={index < PRELOAD_COUNT}
          />
        );

        if (!selectedWishIds) {
          /** 파싱 중인 위시는 상세 진입 불가 */
          if (item.status === ITEM_STATUS.PARSING) return <li key={wish.id}>{card}</li>;

          return (
            <li key={wish.id}>
              <Link
                href={ROUTES.WISH_EDIT(wish.id)}
                data-scroll-anchor-id={wish.id}
                onClick={event => handleLinkClick(event, wish.id)}
                className="block"
              >
                {card}
              </Link>
            </li>
          );
        }

        const isSelected = selectedWishIds.has(wish.id);
        return (
          <li key={wish.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleSelect?.(wish.id)}
              className="relative w-full cursor-pointer text-left"
            >
              {card}
              <span
                style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
                className="pointer-events-none absolute top-[15px] right-[15px]"
              >
                {isSelected ? (
                  <CheckboxSelectedIconFill className="size-[18px] text-bg-accent" />
                ) : (
                  <CheckboxEmptyIconFill className="size-[18px] text-black/8" />
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default WishGrid;
