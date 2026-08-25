'use client';

import type { ProductT } from '../../_common/_types/tournament';
import useCardSelectionAnimation from '../_hooks/useCardSelectionAnimation';
import ProductCard from './ProductCard';

const HANGER_HEIGHT = 54;
const HOOK_HEIGHT = 33;
const IMAGE_HEIGHT = 123;
const HORIZONTAL_LINE_WIDTH = 304.524;
const DASH_V =
  'repeating-linear-gradient(to bottom, rgba(77,77,77,0.60) 0, rgba(77,77,77,0.60) 3px, transparent 3px, transparent 6px)';
const DASH_H =
  'repeating-linear-gradient(to right, rgba(77,77,77,0.60) 0, rgba(77,77,77,0.60) 3px, transparent 3px, transparent 6px)';

type VsSectionProps = {
  left: ProductT;
  right: ProductT;
  isFinal?: boolean;
  onSelect: (winner: ProductT) => void;
};

function VsSection({ left, right, isFinal = false, onSelect }: VsSectionProps) {
  const {
    handleClick,
    selectedSide,
    animationDuration,
    hangerRotate,
    leftCardShift,
    rightCardShift,
    leftCardStyle,
    rightCardStyle,
  } = useCardSelectionAnimation(onSelect);

  const transition = 'transition-all ease-in-out';
  const duration = { transitionDuration: `${animationDuration}ms` };

  return (
    <div className="w-full">
      {/* 헹거 영역 — 결승에선 제거 */}
      {!isFinal && (
        <div className="relative" style={{ height: HANGER_HEIGHT }}>
          <div
            className="absolute top-0 left-1/2 h-full -translate-x-1/2"
            style={{
              width: '1px',
              backgroundImage: DASH_V,
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
            }}
          />
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${transition}`}
            style={{
              width: HORIZONTAL_LINE_WIDTH,
              height: '1px',
              backgroundImage: DASH_H,
              transform: `rotate(${hangerRotate}deg)`,
              ...duration,
            }}
          />
        </div>
      )}

      {/* 카드 영역 */}
      <div className="flex justify-center gap-1.5">
        {/* 왼쪽 */}
        <div
          className={`flex w-[148px] flex-col items-center ${transition}`}
          style={{
            transform: `translateY(${leftCardShift}px) scale(${leftCardStyle.scale})`,
            ...(leftCardStyle.blur > 0 && { filter: `blur(${leftCardStyle.blur}px)` }),
            ...duration,
          }}
        >
          {!isFinal && (
            <div
              style={{
                width: '1px',
                height: HOOK_HEIGHT,
                backgroundImage: DASH_V,
              }}
            />
          )}
          <ProductCard
            {...left}
            isFinal={isFinal}
            isPicked={selectedSide === 'left'}
            onClick={() => handleClick('left', left)}
          />
        </div>

        {/* VS 뱃지 */}
        <div
          className={`z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-neutral-secondary text-[12.026px] leading-[17.18px] font-semibold tracking-[-0.515px] text-white ${transition}`}
          style={{
            marginTop: isFinal ? IMAGE_HEIGHT / 2 - 16 : HOOK_HEIGHT + IMAGE_HEIGHT - 16,
            filter: selectedSide ? 'blur(2px)' : 'none',
            ...duration,
          }}
        >
          VS
        </div>

        {/* 오른쪽 */}
        <div
          className={`flex w-[148px] flex-col items-center ${transition}`}
          style={{
            transform: `translateY(${rightCardShift}px) scale(${rightCardStyle.scale})`,
            ...(rightCardStyle.blur > 0 && { filter: `blur(${rightCardStyle.blur}px)` }),
            ...duration,
          }}
        >
          {!isFinal && (
            <div
              style={{
                width: '1px',
                height: HOOK_HEIGHT,
                backgroundImage: DASH_V,
              }}
            />
          )}
          <ProductCard
            {...right}
            isFinal={isFinal}
            isPicked={selectedSide === 'right'}
            onClick={() => handleClick('right', right)}
          />
        </div>
      </div>
    </div>
  );
}

export default VsSection;
