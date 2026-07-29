import { useLayoutEffect } from 'react';

import { SCROLL_CONTAINER_ID } from '@/consts/layout';

const STORAGE_KEY_PREFIX = 'scroll:/archive/wish:';

/** history entry에 심어두는 식별자 — 같은 entry 로 되돌아왔는지 판별하는 데 쓴다 */
const HISTORY_STATE_KEY = '__pikiScrollKey';

/** 목록 높이가 복원 위치까지 자라기를 기다리는 최대 시간 */
const RESTORE_DEADLINE_MS = 1000;

const getHistoryKey = () => {
  const state: Record<string, unknown> = window.history.state ?? {};
  const key = state[HISTORY_STATE_KEY];
  if (typeof key === 'string') return key;

  const newKey = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  window.history.replaceState({ ...state, [HISTORY_STATE_KEY]: newKey }, '');

  return newKey;
};

export const useScrollRestoration = () => {
  useLayoutEffect(() => {
    const container = document.getElementById(SCROLL_CONTAINER_ID);
    if (!container) return;

    const storageKey = `${STORAGE_KEY_PREFIX}${getHistoryKey()}`;

    let isRestoring = false;
    let saveFrame = 0;
    let restoreFrame = 0;
    let releaseFrame = 0;

    const handleScroll = () => {
      if (isRestoring) return;

      cancelAnimationFrame(saveFrame);
      saveFrame = requestAnimationFrame(() => {
        sessionStorage.setItem(storageKey, String(container.scrollTop));
      });
    };

    const saved = Number(sessionStorage.getItem(storageKey) ?? 0);

    if (saved > 0) {
      isRestoring = true;
      const deadline = performance.now() + RESTORE_DEADLINE_MS;

      /** 목록 렌더링 전에는 scrollTop이 최대 스크롤 범위로 제한될 수 있어 목표 위치에 도달할 때까지 복원 재시도 */
      const restore = () => {
        container.scrollTop = saved;

        if (container.scrollTop < saved && performance.now() < deadline) {
          restoreFrame = requestAnimationFrame(restore);
          return;
        }

        /** 복원 과정에서 발생한 scroll 이벤트가 저장되지 않도록 한 프레임 뒤에 복원 플래그 해제 */
        releaseFrame = requestAnimationFrame(() => {
          isRestoring = false;
        });
      };

      restore();
    }

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(saveFrame);
      cancelAnimationFrame(restoreFrame);
      cancelAnimationFrame(releaseFrame);
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
};
