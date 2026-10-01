'use client';

import { HAPTIC_STYLE } from '@piki/core';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { cn } from '@/utils/cn';
import { triggerHaptic } from '@/utils/haptic';

export type WheelColumnHandleT = {
  /** 현재 스크롤 위치로부터 인덱스를 즉시 계산해 반환 (디바운스 무시) */
  getCurrentIndex: () => number;
};

type WheelColumnProps = {
  /** 휠에 노출할 값 목록 (예: ['1','2',...,'12']) */
  items: string[];
  /** 현재 선택된 인덱스 */
  selectedIndex: number;
  /** 선택이 바뀔 때 호출 */
  onChange: (index: number) => void;
  /** 한 항목 높이 (px) — 시안 기준 36 */
  itemHeight?: number;
  /** 표시되는 행 수 (홀수, 가운데가 선택). 시안 기준 5 */
  visibleRows?: number;
  className?: string;
};

/**
 * 한 열짜리 휠 picker.
 * - scroll-snap-y mandatory 로 자연스러운 휠 스냅
 * - 위·아래 행은 opacity 로 흐릿하게
 * - 스크롤 종료를 감지해 onChange 호출
 * - ref 의 getCurrentIndex 로 디바운스 대기 없이 현재 인덱스를 즉시 계산 가능
 */
const WheelColumn = forwardRef<WheelColumnHandleT, WheelColumnProps>(function WheelColumn(
  { items, selectedIndex, onChange, itemHeight = 36, visibleRows = 5, className },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const lastEmittedIndexRef = useRef(selectedIndex);
  const lastTickedIndexRef = useRef(selectedIndex);

  const padRows = Math.floor(visibleRows / 2);
  const containerHeight = itemHeight * visibleRows;

  // 첫 마운트에서만 selectedIndex 에 맞춰 스크롤 위치 초기화.
  // 이후엔 사용자 인터랙션(드래그/클릭) 으로만 위치가 바뀌고, 외부 selectedIndex 는 따라온다.
  // (effect 가 selectedIndex 변경 시마다 강제 리셋하면 드래그 직후 위치가 되돌아간다.)
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasInitializedRef.current) return;
    el.scrollTop = selectedIndex * itemHeight;
    lastEmittedIndexRef.current = selectedIndex;
    lastTickedIndexRef.current = selectedIndex;
    hasInitializedRef.current = true;
  }, [selectedIndex, itemHeight]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const tickIndex = Math.max(
      0,
      Math.min(items.length - 1, Math.round(el.scrollTop / itemHeight))
    );
    if (tickIndex !== lastTickedIndexRef.current) {
      lastTickedIndexRef.current = tickIndex;
      triggerHaptic(HAPTIC_STYLE.SELECTION);
    }

    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = window.setTimeout(() => {
      const nextIndex = Math.round(el.scrollTop / itemHeight);
      const clamped = Math.max(0, Math.min(items.length - 1, nextIndex));
      if (clamped !== lastEmittedIndexRef.current) {
        lastEmittedIndexRef.current = clamped;
        onChange(clamped);
      }
    }, 80);
  };

  useImperativeHandle(ref, () => ({
    getCurrentIndex: () => {
      const el = containerRef.current;
      if (!el) return selectedIndex;
      const nextIndex = Math.round(el.scrollTop / itemHeight);
      return Math.max(0, Math.min(items.length - 1, nextIndex));
    },
  }));

  // 클릭한 항목으로 부드럽게 스크롤. native scroll-snap 이 가운데 정렬 마무리.
  const handleItemClick = (index: number) => {
    const el = containerRef.current;
    if (!el || index === selectedIndex) return;
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    el.scrollTo({ top: clamped * itemHeight, behavior: 'smooth' });
  };

  /**
   * 마우스/펜으로 컨테이너를 직접 드래그해 휠을 굴리는 인터랙션.
   * 드래그 중에는 scroll-snap 을 꺼서 자유롭게 끌고, 떼면 다시 켜서 가까운 항목에 스냅한다.
   * touch 는 native momentum scroll 이 더 자연스러우니 mouse/pen 만 가로챈다.
   */
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<{ startY: number; startScrollTop: number; moved: boolean } | null>(
    null
  );
  // pointerup 후 발생하는 click 을 차단하기 위한 플래그 — pointerEnd 에서 true,
  // 그 직후의 click 핸들러에서 한 번 소비하면 false 로 되돌린다.
  const suppressNextClickRef = useRef(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return; // touch 는 native 처리
    const el = containerRef.current;
    if (!el) return;
    event.preventDefault();
    dragStateRef.current = {
      startY: event.clientY,
      startScrollTop: el.scrollTop,
      moved: false,
    };
    el.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    const el = containerRef.current;
    if (!state || !el) return;
    const dy = event.clientY - state.startY;
    if (Math.abs(dy) > 2) state.moved = true;
    el.scrollTop = state.startScrollTop - dy;
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    const el = containerRef.current;
    if (!state || !el) return;
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    const finalScrollTop = el.scrollTop;
    const wasMoved = state.moved;
    dragStateRef.current = null;
    setIsDragging(false);
    // 드래그였다면 뒤이어 발생할 click 이벤트를 한 번만 차단해 의도치 않은 점프를 막는다.
    if (wasMoved) suppressNextClickRef.current = true;
    // 드래그 후 가장 가까운 항목으로 스냅 + 즉시 onChange 호출 (디바운스 의존 X).
    const nextIndex = Math.round(finalScrollTop / itemHeight);
    const clamped = Math.max(0, Math.min(items.length - 1, nextIndex));
    el.scrollTo({ top: clamped * itemHeight, behavior: 'smooth' });
    if (clamped !== lastEmittedIndexRef.current) {
      lastEmittedIndexRef.current = clamped;
      onChange(clamped);
    }
  };

  /** 드래그 직후 발생하는 click 이벤트 차단 (pointerup 의 suppress 플래그를 한 번만 소비). */
  const handleItemMouseClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      event.preventDefault();
      return;
    }
    handleItemClick(index);
  };

  const getOpacity = (distance: number) => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.4;
    return 0.2;
  };

  return (
    <div className={cn('relative', className)} style={{ height: containerHeight, width: '100%' }}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className={cn(
          'hide-scrollbar h-full overflow-y-scroll',
          // snap 은 컨테이너 차원에서 안 쓴다 — 우리가 scrollTo(N*itemHeight) 로 직접 정렬.
          // (snap-mandatory 가 들어가면 사용자가 끝까지 끌어도 가장 가까운 항목으로 되돌아간다.)
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
      >
        {/* 위/아래 패딩 — 첫·마지막 항목도 가운데 정렬되도록 */}
        <div style={{ height: itemHeight * padRows }} />
        {items.map((item, index) => {
          const distance = Math.abs(index - selectedIndex);
          return (
            <div
              key={`${item}-${index}`}
              onClick={event => handleItemMouseClick(event, index)}
              className="flex w-full items-center justify-center body-1-bold text-text-neutral-primary select-none"
              style={{ height: itemHeight, opacity: getOpacity(distance) }}
            >
              {item}
            </div>
          );
        })}
        <div style={{ height: itemHeight * padRows }} />
      </div>

      {/* 가운데 선택 영역을 흐릿한 회색 줄로 표시 */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 left-0 rounded-md bg-bg-layer-basement/60"
        style={{ top: itemHeight * padRows, height: itemHeight }}
      />
    </div>
  );
});

export default WheelColumn;
