'use client';

import { useState } from 'react';

import type { CardSideT, ProductT } from '../../_common/_types/tournament';

const NEXT_MATCH_DELAY_MS = 1500;
const FINAL_MATCH_DELAY_MS = 3000;

type UseCardSelectionAnimationArgs = {
  isFinal: boolean;
  onPick?: () => void;
  onSelect: (winner: ProductT) => void;
};

const useCardSelectionAnimation = ({
  isFinal,
  onPick,
  onSelect,
}: UseCardSelectionAnimationArgs) => {
  const [selectedSide, setSelectedSide] = useState<CardSideT | null>(null);

  const handleClick = (side: CardSideT, product: ProductT) => {
    /** 애니메이션 중 추가 탭 무시 */
    if (selectedSide) return;

    setSelectedSide(side);
    onPick?.();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onSelect(product);
      return;
    }
    setTimeout(() => onSelect(product), isFinal ? FINAL_MATCH_DELAY_MS : NEXT_MATCH_DELAY_MS);
  };

  return { handleClick, selectedSide };
};

export default useCardSelectionAnimation;
