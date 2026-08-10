'use client';

import { useLayoutEffect } from 'react';

import type { ScrollRestorationTargetT } from '@/utils/scrollRestoration';
import {
  SCROLL_ANCHOR_ID_ATTR,
  clearScrollAnchor,
  getAnchorOffset,
  getScrollContainer,
  readScrollAnchor,
} from '@/utils/scrollRestoration';

const RESTORE_DEADLINE_MS = 1000;
const TOLERANCE_PX = 1;

export const useScrollRestoration = ({ namespace, scope }: ScrollRestorationTargetT) => {
  useLayoutEffect(() => {
    const scroller = getScrollContainer();
    if (!scroller) return;

    const target = { namespace, scope };
    const anchor = readScrollAnchor(target);
    if (!anchor) return;

    let frame = 0;
    const deadline = performance.now() + RESTORE_DEADLINE_MS;

    /** 항목 렌더링이 끝나기 전에는 한 번에 복원되지 않을 수 있어 deadline 까지 재시도 */
    const restore = () => {
      const element = scroller.querySelector<HTMLElement>(
        `[${SCROLL_ANCHOR_ID_ATTR}="${anchor.anchorId}"]`
      );

      if (element) {
        const delta = getAnchorOffset(scroller, element) - anchor.offset;
        if (Math.abs(delta) < TOLERANCE_PX) {
          clearScrollAnchor(target);
          return;
        }

        scroller.scrollTop += delta;
      }

      if (performance.now() < deadline) frame = requestAnimationFrame(restore);
    };

    restore();

    return () => cancelAnimationFrame(frame);
  }, [namespace, scope]);
};
