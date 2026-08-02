'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

const ENTRY_HISTORY_LENGTH_KEY = 'piki:entryHistoryLength';

/** 앱 진입 시점의 history 길이를 기준으로 앱 내부에서 생성된 history만 판단 */
const getEntryHistoryLength = () => {
  const stored = Number(sessionStorage.getItem(ENTRY_HISTORY_LENGTH_KEY));

  return Number.isInteger(stored) && stored > 0 ? stored : 1;
};

/** 앱 진입 시점의 history 길이를 탭 세션에 기록 */
export const useTrackAppEntry = () => {
  useEffect(() => {
    if (sessionStorage.getItem(ENTRY_HISTORY_LENGTH_KEY) !== null) return;

    sessionStorage.setItem(ENTRY_HISTORY_LENGTH_KEY, String(window.history.length));
  }, []);
};

export const useBackWithFallback = () => {
  const router = useRouter();

  return useCallback(
    (fallback: string) => {
      if (window.history.length > getEntryHistoryLength()) {
        router.back();
        return;
      }

      router.replace(fallback);
    },
    [router]
  );
};
