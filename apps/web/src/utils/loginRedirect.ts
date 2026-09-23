import type { QueryActionValueT } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import isSafeInternalPath from '@/utils/isSafeInternalPath';

const LOGIN_REDIRECT_STORAGE_KEY = 'login_redirect';

export const isValidLoginRedirectPath = (path: string | null | undefined): path is string =>
  isSafeInternalPath(path);

export const setLoginRedirectPath = (redirectPath: string | null) => {
  if (typeof window === 'undefined') return;

  if (!isValidLoginRedirectPath(redirectPath)) {
    sessionStorage.removeItem(LOGIN_REDIRECT_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(LOGIN_REDIRECT_STORAGE_KEY, redirectPath);
};

export const getLoginRedirectPath = (path?: string | null): string => {
  if (isValidLoginRedirectPath(path)) return path;

  if (typeof window !== 'undefined') {
    const storedRedirect = sessionStorage.getItem(LOGIN_REDIRECT_STORAGE_KEY);
    if (isValidLoginRedirectPath(storedRedirect)) return storedRedirect;
  }

  return ROUTES.HOME;
};

export const clearLoginRedirectPath = () => {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem(LOGIN_REDIRECT_STORAGE_KEY);
};

export const getLoginPath = (
  redirectPath: string | null,
  action?: QueryActionValueT,
  /** 로그인 페이지가 code 로 카탈로그 문구를 띄울 수 있도록 서버 에러 코드를 전달 */
  errorCode?: string | null
): string => {
  const searchParams = new URLSearchParams();
  if (isValidLoginRedirectPath(redirectPath)) searchParams.set('redirect', redirectPath);
  if (action) searchParams.set('action', action);
  if (errorCode) searchParams.set('code', errorCode);
  if (!searchParams.size) return ROUTES.LOGIN;

  return `${ROUTES.LOGIN}?${searchParams.toString()}`;
};
