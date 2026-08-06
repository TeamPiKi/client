'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

/** 앱 내부에서 쌓인 히스토리 깊이. 진입 화면이 0 이고, push 될 때마다 1씩 늘어난다. */
type PikiHistoryStateT = { pikiDepth?: number };

let currentDepth = 0;
let lastHistoryLength: number | null = null;

const readStampedDepth = () => {
  const state = window.history.state as PikiHistoryStateT | null;

  return typeof state?.pikiDepth === 'number' ? state.pikiDepth : null;
};

const stampDepth = (depth: number) => {
  window.history.replaceState({ ...window.history.state, pikiDepth: depth }, '');
};

export const useTrackAppHistoryDepth = () => {
  const pathname = usePathname();

  useEffect(() => {
    const stampedDepth = readStampedDepth();

    if (stampedDepth !== null) {
      currentDepth = stampedDepth;
    } else {
      /**
       * push만 history.length가 증가하므로 길이 변화로 push/replace를 구분한다.
       * replace만 이어진 진입은 깊이 0을 유지한다.
       */
      const isPushed = lastHistoryLength !== null && window.history.length > lastHistoryLength;

      if (isPushed) currentDepth += 1;
      stampDepth(currentDepth);
    }

    lastHistoryLength = window.history.length;
  }, [pathname]);
};

export const useBackWithFallback = () => {
  const router = useRouter();

  return useCallback(
    (fallback: string) => {
      /** 깊이가 0 이면 앱 진입 화면이라 back 이 앱 밖으로 나간다 */
      if (currentDepth > 0) {
        router.back();
        return;
      }

      router.replace(fallback);
    },
    [router]
  );
};
