'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { TrophyIconFill } from '@/assets/icons';
import { cn } from '@/utils/cn';

import { carmenSans } from '../../_common/_consts/font';
import './RoundTicker.css';

/** RoundTicker 움직이는 속도 */
const SPEED_PX_PER_SEC = 567 / 30;
/** 한 벌에 넣을 라벨 수 */
const REPEAT_COUNT = 6;

type RoundTickerProps = {
  /** 현재 라운드 아이템 수 (16 · 8 · 4 · 2) */
  currentRound: number;
  isFinal?: boolean;
};

function RoundTicker({ currentRound, isFinal = false }: RoundTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [durationSec, setDurationSec] = useState(30);
  const label = isFinal ? 'Final' : `Round of ${currentRound}`;

  /** 라벨 폭이 라운드마다 달라 한 벌 너비를 재서 속도를 일정하게 맞춤 */
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    setDurationSec(track.scrollWidth / 2 / SPEED_PX_PER_SEC);
  }, [label]);

  const halfClassName = cn('flex shrink-0', isFinal ? 'gap-15 pr-15' : 'gap-14 pr-14');
  const items = Array.from({ length: REPEAT_COUNT }, (_, index) => (
    <span key={index} className="flex shrink-0 items-center gap-[7px]">
      <TrophyIconFill className="size-5.5 text-sky-blue-200" />
      <span
        className={cn(carmenSans.className, 'text-[16px] leading-6 font-bold text-sky-blue-200')}
      >
        {label}
      </span>
    </span>
  ));

  return (
    <>
      <span className="sr-only">{label}</span>
      <div
        aria-hidden
        className="flex h-[46px] w-full items-center overflow-hidden bg-linear-to-r from-white/60 to-white/80"
      >
        <div
          ref={trackRef}
          className="round-ticker-track flex w-max"
          style={{ '--round-ticker-duration': `${durationSec}s` } as CSSProperties}
        >
          <div className={halfClassName}>{items}</div>
          <div className={halfClassName}>{items}</div>
        </div>
      </div>
    </>
  );
}

export default RoundTicker;
