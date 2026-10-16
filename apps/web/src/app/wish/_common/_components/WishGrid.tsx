import { CheckboxEmptyIconFill, CheckboxSelectedIconFill } from '@/assets/icons';
import { Z_INDEX } from '@/consts/zIndex';

import type { WishListItemT } from '../_types/wish';
import WishCard from './WishCard';

type WishGridProps = {
  wishes: WishListItemT[];
  selectedWishIds?: Set<number>;
  onToggleSelect?: (wishId: number) => void;
};

/** 이미지 preload 개수 */
const PRELOAD_COUNT = 6;

/** 위시 3열 그리드 **/
function WishGrid({ wishes, selectedWishIds, onToggleSelect }: WishGridProps) {
  return (
    <ul className="grid grid-cols-3 gap-x-[1.5px] gap-y-6">
      {wishes.map(({ wish, item }, index) => {
        const card = (
          <WishCard
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            sourcePlatform={item.sourcePlatform}
            discountRate={item.discountRate}
            preload={index < PRELOAD_COUNT}
          />
        );

        if (!selectedWishIds) return <li key={wish.id}>{card}</li>;

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
