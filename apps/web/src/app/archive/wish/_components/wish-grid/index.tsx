import Link from 'next/link';

import { CheckboxEmptyIconFill, CheckboxSelectedIconFill } from '@/assets/icons';
import WishCard from '@/components/common/wish-card';
import { ROUTES } from '@/consts/route';
import type { WishItemT } from '@/types/wish';

import WishFailedCard from './WishFailedCard';
import WishProcessingCard from './WishProcessingCard';

type WishGridProps = {
  items: WishItemT[];
  isDeleteMode?: boolean;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
};

function WishGrid({ items, isDeleteMode = false, selectedIds, onToggleSelect }: WishGridProps) {
  return (
    <div className="grid grid-cols-2">
      {items.map((item, index) => {
        if (item.status === 'FAILED')
          return (
            <Link href={ROUTES.WISH_EDIT(item.id)} key={item.id}>
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
              <WishCard name={item.name} price={item.price} imageUrl={item.imageUrl} sourcePlatform={item.sourcePlatform} />
              <span className="pointer-events-none absolute top-3 left-3 z-10 size-6">
                {isSelected ? (
                  <CheckboxSelectedIconFill className="relative size-6 text-bg-accent" />
                ) : (
                  <CheckboxEmptyIconFill className="relative size-6 text-black/8" />
                )}
              </span>
            </button>
          );
        }

        return (
          <Link href={ROUTES.WISH_EDIT(item.id)} key={item.id}>
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
