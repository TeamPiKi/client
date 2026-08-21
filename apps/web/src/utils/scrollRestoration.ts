import { SCROLL_CONTAINER_ID } from '@/consts/layout';

const STORAGE_KEY_PREFIX = 'piki:scroll:';

const HISTORY_STATE_KEY = '__pikiScrollKey';

/** 스크롤 복원 기준 카드를 식별하기 위한 속성 */
export const SCROLL_ANCHOR_ID_ATTR = 'data-scroll-anchor-id';

export const SCROLL_NAMESPACE = {
  ARCHIVE_WISH: 'archiveWish',
  ARCHIVE_TOURNAMENT: 'archiveTournament',
} as const;

type ScrollAnchorT = {
  anchorId: number;
  offset: number;
};

export type ScrollRestorationTargetT = {
  namespace: string;
  scope?: string;
};

const getStorageKey = ({ namespace, scope }: ScrollRestorationTargetT) => {
  const state: Record<string, unknown> = window.history.state ?? {};
  const stored = state[HISTORY_STATE_KEY];

  let entryKey: string;
  if (typeof stored === 'string') {
    entryKey = stored;
  } else {
    entryKey = Math.random().toString(36).slice(2, 8);
    window.history.replaceState({ ...state, [HISTORY_STATE_KEY]: entryKey }, '');
  }

  return `${STORAGE_KEY_PREFIX}${namespace}:${scope ? `${scope}:` : ''}${entryKey}`;
};

export const getScrollContainer = () => document.getElementById(SCROLL_CONTAINER_ID);

export const getAnchorOffset = (container: HTMLElement, anchor: HTMLElement) =>
  anchor.getBoundingClientRect().top - container.getBoundingClientRect().top;

export const saveScrollAnchor = (
  target: ScrollRestorationTargetT,
  element: HTMLElement,
  anchorId: number
) => {
  const scroller = getScrollContainer();
  if (!scroller) return;

  const anchor: ScrollAnchorT = { anchorId, offset: getAnchorOffset(scroller, element) };

  try {
    sessionStorage.setItem(getStorageKey(target), JSON.stringify(anchor));
  } catch {
    /** 스크롤 복원 실패는 치명적이지 않으므로 무시 */
  }
};

export const readScrollAnchor = (target: ScrollRestorationTargetT): ScrollAnchorT | null => {
  try {
    const raw = sessionStorage.getItem(getStorageKey(target));
    if (!raw) return null;

    const { anchorId, offset }: Record<string, unknown> = JSON.parse(raw);
    if (typeof anchorId !== 'number' || typeof offset !== 'number') return null;

    return { anchorId, offset };
  } catch {
    return null;
  }
};

export const clearScrollAnchor = (target: ScrollRestorationTargetT) => {
  try {
    sessionStorage.removeItem(getStorageKey(target));
  } catch {
    /** 값이 남아도 무해하므로 무시 */
  }
};
