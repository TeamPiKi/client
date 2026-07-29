import { useLayoutEffect } from 'react';

import { SCROLL_CONTAINER_ID } from '@/consts/layout';

const STORAGE_KEY = 'scroll:/archive/wish';

let isPopNavigation = false;

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    isPopNavigation = true;
  });
}

export const useScrollRestoration = () => {
  useLayoutEffect(() => {
    const container = document.getElementById(SCROLL_CONTAINER_ID);
    if (!container) return;

    if (isPopNavigation) {
      isPopNavigation = false;
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) container.scrollTop = Number(saved);
    }

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        sessionStorage.setItem(STORAGE_KEY, String(container.scrollTop));
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
};
