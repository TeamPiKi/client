import Link from 'next/link';

import WishCard from '@/app/archive/_components/wish-grid/WishCard';
import WishFailedCard from '@/app/archive/_components/wish-grid/WishFailedCard';
import { CheckboxEmptyIconFill, CheckboxSelectedIconFill } from '@/assets/icons';
import { ROUTES } from '@/consts/route';

import type { WishItemT } from '../../_types/wish';
import WishProcessingCard from './WishProcessingCard';

type WishGridProps = {
  items: WishItemT[];
  isDeleteMode?: boolean;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
};

function WishGrid({ items, isDeleteMode = false, selectedIds, onToggleSelect }: WishGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-3">
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
              <span className="pointer-events-none absolute top-3 left-3 z-10 size-6">
                <span className="absolute inset-[3px] rounded-[3px] bg-white" />
                {isSelected ? (
                  <CheckboxSelectedIconFill className="relative size-6 text-uac-light" />
                ) : (
                  <CheckboxEmptyIconFill className="relative size-6 text-[#636366]" />
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
              preload={index < 4} // 4개 이미지 로딩 전까지는 preload
            />
          </Link>
        );
      })}
    </div>
  );
}

export default WishGrid;
