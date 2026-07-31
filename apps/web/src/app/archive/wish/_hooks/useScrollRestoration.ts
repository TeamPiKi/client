import { useLayoutEffect } from 'react';

import {
  WISH_CARD_ID_ATTR,
  clearWishScroll,
  getCardOffset,
  getScrollContainer,
  readWishScroll,
} from '../_utils/wishScroll';

const RESTORE_DEADLINE_MS = 1000;
const TOLERANCE_PX = 1;

export const useScrollRestoration = () => {
  useLayoutEffect(() => {
    const container = getScrollContainer();
    if (!container) return;

    const anchor = readWishScroll();
    if (!anchor) return;

    let frame = 0;
    const deadline = performance.now() + RESTORE_DEADLINE_MS;

    /** 카드 렌더링이 끝나기 전에는 한 번에 복원되지 않을 수 있어 deadline까지 스크롤 복원 재시도 */
    const restore = () => {
      const card = container.querySelector<HTMLElement>(
        `[${WISH_CARD_ID_ATTR}="${anchor.wishId}"]`
      );

      if (card) {
        const delta = getCardOffset(container, card) - anchor.offset;
        if (Math.abs(delta) < TOLERANCE_PX) {
          clearWishScroll();
          return;
        }

        container.scrollTop += delta;
      }

      if (performance.now() < deadline) frame = requestAnimationFrame(restore);
    };

    restore();

    return () => cancelAnimationFrame(frame);
  }, []);
};
