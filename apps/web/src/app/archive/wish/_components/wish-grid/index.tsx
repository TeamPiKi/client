import Link from 'next/link';

import CheckboxSelectedIconFill from '@/assets/icons/fill/checkbox-selected.svg';
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
              <WishCard name={item.name} price={item.price} imageUrl={item.imageUrl} />
              <div className={`pointer-events-none absolute top-0 left-0 right-0 z-[11] aspect-[201/166] bg-black/20 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
              <span className="pointer-events-none absolute top-3 left-3 z-[12] block size-5 overflow-hidden">
                {isSelected ? (
                  <>
                    <span className="absolute inset-0.5 bg-white" />
                    <CheckboxSelectedIconFill className="absolute inset-0 size-5 origin-center scale-[1.334] text-uac-light" />
                  </>
                ) : (
                  <span className="absolute inset-0 rounded border-[1.4px] border-white bg-black/[0.08]" />
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
              preload={index < 4}
            />
          </Link>
        );
      })}
    </div>
  );
}

export default WishGrid;
