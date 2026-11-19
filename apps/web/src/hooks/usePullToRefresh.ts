import { type RefObject, useEffect, useEffectEvent, useState } from 'react';
import { toast } from 'sonner';

import {
  INDICATOR_HEIGHT,
  MAX_PULL_DISTANCE,
  PULL_RESISTANCE,
} from '@/components/common/pull-to-refresh/pullToRefresh.const';
import { getApiErrorStatus, isWithdrawnAccountError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { getScrollContainer } from '@/utils/scrollRestoration';

export const usePullToRefresh = (
  onRefresh: () => Promise<unknown>,
  {
    enabled = true,
    scrollerRef,
  }: { enabled?: boolean; scrollerRef?: RefObject<HTMLElement | null> } = {}
) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useEffectEvent(() => onRefresh());

  useEffect(() => {
    if (!enabled) return;

    const scroller = scrollerRef ? scrollerRef.current : getScrollContainer();
    if (!scroller) return;

    let startY: number | null = null;
    let distance = 0;
    let isLocked = false;

    const reset = () => {
      startY = null;
      distance = 0;
      setIsPulling(false);
      setPullDistance(0);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (isLocked || scroller.scrollTop > 0) return;
      startY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (startY === null) return;

      const delta = (event.touches[0]?.clientY ?? startY) - startY;
      if (delta <= 0 || scroller.scrollTop > 0) {
        reset();
        return;
      }

      event.preventDefault();
      distance = Math.min(delta * PULL_RESISTANCE, MAX_PULL_DISTANCE);
      setIsPulling(true);
      setPullDistance(distance);
    };

    const handleTouchEnd = async () => {
      if (startY === null) return;
      if (distance < INDICATOR_HEIGHT) {
        reset();
        return;
      }

      startY = null;
      distance = 0;
      isLocked = true;
      setIsPulling(false);
      setIsRefreshing(true);
      setPullDistance(INDICATOR_HEIGHT);

      try {
        await refresh();
      } catch (error) {
        if (getApiErrorStatus(error) !== 401 && !isWithdrawnAccountError(error))
          toast.error(getApiErrorMessage(error));
      } finally {
        isLocked = false;
        setIsRefreshing(false);
        setPullDistance(0);
      }
    };

    scroller.addEventListener('touchstart', handleTouchStart, { passive: true });
    scroller.addEventListener('touchmove', handleTouchMove, { passive: false });
    scroller.addEventListener('touchend', handleTouchEnd);
    scroller.addEventListener('touchcancel', reset);

    return () => {
      reset();
      scroller.removeEventListener('touchstart', handleTouchStart);
      scroller.removeEventListener('touchmove', handleTouchMove);
      scroller.removeEventListener('touchend', handleTouchEnd);
      scroller.removeEventListener('touchcancel', reset);
    };
  }, [enabled, scrollerRef]);

  return { pullDistance, isPulling, isRefreshing };
};
