'use client';

import { cn } from '@/utils/cn';

import type { CardSideT, ProductT } from '../../_common/_types/tournament';
import useCardSelectionAnimation from '../_hooks/useCardSelectionAnimation';
import ProductCard from './ProductCard';
import VsBadge from './VsBadge';

type VsSectionProps = {
  left: ProductT;
  right: ProductT;
  onSelect: (winner: ProductT) => void;
};

function VsSection({ left, right, onSelect }: VsSectionProps) {
  const { handleClick, selectedSide } = useCardSelectionAnimation(onSelect);

  const getCardClassName = (side: CardSideT) => {
    if (!selectedSide) return '';
    return selectedSide === side ? 'scale-[1.11]' : 'scale-[0.91] opacity-50';
  };

  return (
    <div className="relative flex justify-center gap-[22px]">
      <div className={cn('transition-[transform,opacity] duration-450', getCardClassName('left'))}>
        <ProductCard
          {...left}
          isPicked={selectedSide === 'left'}
          onClick={() => handleClick('left', left)}
        />
      </div>
      <div className={cn('transition-[transform,opacity] duration-450', getCardClassName('right'))}>
        <ProductCard
          {...right}
          isPicked={selectedSide === 'right'}
          onClick={() => handleClick('right', right)}
        />
      </div>
      <VsBadge className={cn('transition-opacity duration-350', selectedSide && 'opacity-0')} />
    </div>
  );
}

export default VsSection;
