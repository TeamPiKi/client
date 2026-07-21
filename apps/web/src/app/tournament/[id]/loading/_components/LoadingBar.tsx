'use client';

import { useEffect, useState } from 'react';

import { LoaderIconFill } from '@/assets/icons';

const DURATION_MS = 4500;
const TICK_MS = 60;

function LoadingBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const next = Math.min(elapsed / DURATION_MS, 1);
      setProgress(next);
      if (next >= 1) window.clearInterval(interval);
    }, TICK_MS);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="self-start">
        <div className="flex items-center gap-1 rounded-xl bg-bg-layer-default px-3 py-2.5">
          <LoaderIconFill aria-hidden className="size-4 animate-spin text-icon-neutral-secondary" />
          <p className="body-1-medium text-text-neutral-secondary">상품 불러오는 중</p>
        </div>
        <div className="ml-4 size-0 border-x-8 border-t-6 border-x-transparent border-t-white" />
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded bg-gray-100">
        <div
          className="absolute inset-y-0 left-0 rounded bg-bg-accent transition-[width] duration-100 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingBar;
