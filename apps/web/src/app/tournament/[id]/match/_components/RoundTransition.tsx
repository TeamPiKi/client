'use client';

import { useEffect, useState } from 'react';

import { FireIconFill, TrophyIconFill } from '@/assets/icons';

import type { TransitionStageT } from '../_consts/rounds';

type RoundTransitionProps = {
  stage: TransitionStageT;
  title: string;
  description: string;
  duration?: number;
  onComplete: () => void;
};

const ARC_SIZE = 164;
const ARC_STROKE_WIDTH = 4;
const ARC_RADIUS = (ARC_SIZE - ARC_STROKE_WIDTH) / 2;
const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;

function RoundTransition({
  stage,
  title,
  description,
  duration = 3,
  onComplete,
}: RoundTransitionProps) {
  const [remaining, setRemaining] = useState(duration);
  // 마운트 직후 한 프레임 동안 호 가득 → started=true 되면 transition으로 0까지 줄어듦
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setRemaining(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, onComplete]);

  const visibleArcLength = started ? 0 : ARC_CIRCUMFERENCE;
  const arcTransitionDuration = started ? duration * 1000 : 0;
  const isFinal = stage === 'toFinal';

  const containerClassName = isFinal
    ? 'bg-gradient-to-b from-[#ECF8FE] via-[#F5FCFF] to-white'
    : 'bg-bg-layer-basement';

  return (
    <main
      className={`flex min-h-dvh w-full flex-col items-center px-5 pt-padding-top ${containerClassName}`}
    >
      <div className="flex flex-col items-center gap-4">
        {isFinal ? (
          <div className="flex items-center justify-center gap-1.5 rounded-[28px] bg-white px-5 py-3">
            <TrophyIconFill className="size-4.5 text-yellow-400" aria-hidden />
            <span className="heading-2-semibold text-text-neutral-secondary">결승전</span>
          </div>
        ) : (
          <FireIconFill className="size-11 text-icon-accent" aria-hidden />
        )}
        <h1 className="title-1 text-text-neutral-primary">{title}</h1>
      </div>

      <p className="mt-6 text-center heading-2-medium whitespace-pre-line text-text-neutral-secondary">
        {description}
      </p>

      <div className="relative mt-24 flex size-66.25 items-center justify-center">
        {/* 가장 바깥 옅은 링 */}
        <div className="absolute inset-0 rounded-full bg-sky-blue-100/10" aria-hidden />
        {/* 중간 링 */}
        <div className="absolute inset-6 rounded-full bg-sky-blue-100/20" aria-hidden />
        {/* 흰 원 + 카운트다운 호 */}
        <div className="relative flex size-41 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_0_rgba(197,219,251,0.20)]">
          <svg
            width={ARC_SIZE}
            height={ARC_SIZE}
            className="absolute -rotate-90"
            aria-label={`${remaining}초 후 다음 화면`}
          >
            <circle
              cx={ARC_SIZE / 2}
              cy={ARC_SIZE / 2}
              r={ARC_RADIUS}
              stroke="var(--color-sky-blue-300)"
              strokeWidth={ARC_STROKE_WIDTH}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${visibleArcLength} ${ARC_CIRCUMFERENCE}`}
              style={{ transition: `stroke-dasharray ${arcTransitionDuration}ms linear` }}
            />
          </svg>
          <span className="text-[48px] leading-8 font-bold tracking-[-0.6px] text-text-accent">
            {remaining}
          </span>
        </div>
      </div>
    </main>
  );
}

export default RoundTransition;
