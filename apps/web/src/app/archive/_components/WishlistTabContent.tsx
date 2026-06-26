import WishGrid from '@/app/archive/_components/wish-grid';
import { HeartIconFill } from '@/assets/icons';

import type { WishItemT } from '../_types/wish';

type WishlistTabContentProps = {
  items: WishItemT[];
  isDeleteMode?: boolean;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
};

function WishlistTabContent({
  items,
  isDeleteMode,
  selectedIds,
  onToggleSelect,
}: WishlistTabContentProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <HeartIconFill width={32} height={32} className="text-gray-200" />
        <p className="body-1-semibold text-text-neutral-tertiary">아직 담긴 위시템이 없어요</p>
      </div>
    );
  }

  return (
    <WishGrid
      items={items}
      isDeleteMode={isDeleteMode}
      selectedIds={selectedIds}
      onToggleSelect={onToggleSelect}
    />
  );
}

export default WishlistTabContent;
