import type { QueryActionValueT } from '@/consts/queryAction';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { getRouteType } from '@/utils/getRouteType';

const LOGIN_REDIRECT_STORAGE_KEY = 'login_redirect';

export const isValidLoginRedirectPath = (path: string | null | undefined): path is string =>
  !!path && path.startsWith('/') && !path.startsWith('//');

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

/** 로그인 성공 후 이동할 경로 반환 — 회원 전용 경로면 홈으로 보내고 안내 토스트 파라미터를 붙인다 */
export const getPostLoginRedirectPath = (): string => {
  const redirectPath = getLoginRedirectPath();
  const isMemberOnly = getRouteType(redirectPath.split('?')[0] ?? redirectPath) === 'MEMBER_ONLY';

  if (isMemberOnly) return `${ROUTES.HOME}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.MEMBER_ONLY}`;

  return redirectPath;
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
