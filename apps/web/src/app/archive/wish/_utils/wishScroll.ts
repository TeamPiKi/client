import { SCROLL_CONTAINER_ID } from '@/consts/layout';

const STORAGE_KEY_PREFIX = 'piki.wishScroll.';

const HISTORY_STATE_KEY = '__pikiScrollKey';

/** 스크롤 복원 기준 카드를 식별하기 위한 속성 */
export const WISH_CARD_ID_ATTR = 'data-wish-id';

export type WishScrollAnchorT = {
  wishId: number;
  offset: number;
};

const getStorageKey = () => {
  const state: Record<string, unknown> = window.history.state ?? {};
  const key = state[HISTORY_STATE_KEY];
  if (typeof key === 'string') return `${STORAGE_KEY_PREFIX}${key}`;

  const newKey = Math.random().toString(36).slice(2, 8);
  window.history.replaceState({ ...state, [HISTORY_STATE_KEY]: newKey }, '');

  return `${STORAGE_KEY_PREFIX}${newKey}`;
};

export const getScrollContainer = () => document.getElementById(SCROLL_CONTAINER_ID);

export const getCardOffset = (container: HTMLElement, card: HTMLElement) =>
  card.getBoundingClientRect().top - container.getBoundingClientRect().top;

export const saveWishScroll = (card: HTMLElement, wishId: number) => {
  const container = getScrollContainer();
  if (!container) return;

  const anchor: WishScrollAnchorT = { wishId, offset: getCardOffset(container, card) };

  try {
    sessionStorage.setItem(getStorageKey(), JSON.stringify(anchor));
  } catch {
    /** 스크롤 복원 실패는 치명적이지 않으므로 무시 */
  }
};

export const readWishScroll = (): WishScrollAnchorT | null => {
  try {
    const raw = sessionStorage.getItem(getStorageKey());
    if (!raw) return null;

    const { wishId, offset }: Record<string, unknown> = JSON.parse(raw);
    if (typeof wishId !== 'number' || typeof offset !== 'number') return null;

    return { wishId, offset };
  } catch {
    return null;
  }
};

export const clearWishScroll = () => {
  try {
    sessionStorage.removeItem(getStorageKey());
  } catch {
    /** 값이 남아도 무해하므로 무시 */
  }
};
