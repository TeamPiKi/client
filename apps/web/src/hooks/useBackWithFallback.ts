'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/** NOTE: history.length 는 앱 진입 이전 방문 기록도 포함해 그 경우 back 이 앱 밖으로 나간다 */
export const useBackWithFallback = () => {
  const router = useRouter();

  return useCallback(
    (fallback: string) => {
      if (window.history.length > 1) {
        router.back();
        return;
      }

      router.replace(fallback);
    },
    [router]
  );
};
