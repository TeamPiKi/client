'use client';

import { useState } from 'react';

import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

import type { CardSideT, ProductT } from '../../_common/_types/tournament';
import { carmenSans } from '../_consts/font';
import ProductCard from './ProductCard';
import VsBadge from './VsBadge';
import './VsSection.css';

type VsSectionProps = {
  left: ProductT;
  right: ProductT;
  isFinal?: boolean;
  onPick?: () => void;
  onSelect: (winner: ProductT) => void;
};

/** 카드 변형 — 왼쪽 기준이며 오른쪽은 x 반전 */
const CARD_MOVE = {
  /** 일반 매치 */
  win: 'translate-y-[3.25px] scale-[1.11]',
  winLeft: 'translate-x-[6.25px]',
  winRight: '-translate-x-[6.25px]',
  lose: 'translate-y-[3.5px] scale-[0.91] opacity-50',
  loseLeft: '-translate-x-[8.5px]',
  loseRight: 'translate-x-[8.5px]',
  /** 결승 */
  finalWin: 'translate-y-[3.5px] scale-[1.11]',
  finalWinLeft: 'translate-x-[85px]',
  finalWinRight: '-translate-x-[85px]',
  finalLose: 'pointer-events-none translate-y-[30px] opacity-0',
  finalLoseLeft: '-translate-x-[250px] -rotate-[16deg]',
  finalLoseRight: 'translate-x-[250px] rotate-[16deg]',
} as const;

function VsSection({ left, right, isFinal = false, onPick, onSelect }: VsSectionProps) {
  const [selectedSide, setSelectedSide] = useState<CardSideT | null>(null);

  const handleClick = (side: CardSideT, product: ProductT) => {
    if (selectedSide) return;
    setSelectedSide(side);
    onPick?.();
    onSelect(product);
  };

  const getCardClassName = (side: CardSideT) => {
    const isLeft = side === 'left';
    if (!selectedSide) return cn('vs-card', 'active:scale-[0.97]');

    const isPicked = selectedSide === side;
    if (isFinal) {
      return isPicked
        ? cn(
            'vs-card-final-win',
            CARD_MOVE.finalWin,
            isLeft ? CARD_MOVE.finalWinLeft : CARD_MOVE.finalWinRight
          )
        : cn(
            'vs-card-final-lose',
            CARD_MOVE.finalLose,
            isLeft ? CARD_MOVE.finalLoseLeft : CARD_MOVE.finalLoseRight
          );
    }
    return isPicked
      ? cn('vs-card', CARD_MOVE.win, isLeft ? CARD_MOVE.winLeft : CARD_MOVE.winRight)
      : cn('vs-card', CARD_MOVE.lose, isLeft ? CARD_MOVE.loseLeft : CARD_MOVE.loseRight);
  };

  const sides: { side: CardSideT; product: ProductT }[] = [
    { side: 'left', product: left },
    { side: 'right', product: right },
  ];

  return (
    <div className="relative isolate flex justify-center gap-[22px]">
      {sides.map(({ side, product }) => {
        const isPicked = selectedSide === side;
        return (
          <div key={side} className="relative">
            <div
              className={cn(
                'relative rounded-[20px]',
                isPicked && 'shadow-[0_0_0_2px_#76CEFD,0_6px_18px_0_rgba(118,206,253,0.35)]',
                getCardClassName(side)
              )}
              style={isPicked ? { zIndex: Z_INDEX.BASE_IMAGE + 4 } : {}}
            >
              <ProductCard {...product} onClick={() => handleClick(side, product)} />
              {isPicked && (
                <div
                  className={cn(
                    carmenSans.className,
                    'vs-pick',
                    isFinal && 'vs-pick-final',
                    'absolute -top-4 -left-3.5 flex size-15 items-center justify-center rounded-full bg-sky-blue-400 text-[22px] leading-6 font-bold tracking-[-0.6px] text-white shadow-[1px_3px_4px_0_rgba(0,0,0,0.15)]'
                  )}
                  style={{ zIndex: Z_INDEX.BASE_IMAGE + 2 }}
                >
                  <span className="-rotate-15">Pick!</span>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_8.1px_0_#A2DEFF]"
                  />
                </div>
              )}
            </div>
            {isPicked && !isFinal && (
              <div
                aria-hidden
                className="vs-ripple pointer-events-none absolute inset-0 rounded-[20px] border-2 border-sky-blue-400"
              />
            )}
          </div>
        );
      })}
      <VsBadge isPicked={!!selectedSide} isFinal={isFinal} />
    </div>
  );
}

export default VsSection;
