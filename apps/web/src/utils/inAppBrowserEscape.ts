import { ROUTES } from '@/consts/route';

const ESCAPE_ATTEMPTED_KEY = 'piki:in-app-browser-escape';

/**
 * NOTE: AASA 의 exclude 목록과 같이 유지한다.
 * `/auth/callback/*` 은 튕기면 OAuth 가 끊기고, `/open-app` 은 여기서 튕기면 순환한다.
 */
export const isInAppBrowserEscapeExcludedPath = (pathname: string) => {
  if (pathname.startsWith('/auth/callback/')) return true;
  if (pathname === '/api' || pathname.startsWith('/api/')) return true;
  if (pathname === ROUTES.OPEN_APP) return true;
  return false;
};

export const hasAttemptedInAppBrowserEscape = () => {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(ESCAPE_ATTEMPTED_KEY) === '1';
  } catch {
    return false;
  }
};

export const markInAppBrowserEscapeAttempted = () => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(ESCAPE_ATTEMPTED_KEY, '1');
  } catch {
    /** private mode 등 — 무시 */
  }
};
