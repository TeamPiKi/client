import * as Sentry from '@sentry/nextjs';

import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { getLoginPath } from '@/utils/loginRedirect';

/** 로그인 진행 중인 경로 — 세션 만료로 다시 로그인으로 보낼 필요가 없다 */
const isAuthPath = (pathname: string) =>
  pathname === ROUTES.LOGIN ||
  pathname === ROUTES.ROOT ||
  /^\/auth\/callback\/[^/]+$/.test(pathname);

/** 클라이언트 세션 만료 처리 — refresh 로 세션을 이어갈 수 없을 때의 단일 진입점 */
export const handleSessionExpired = () => {
  Sentry.setUser(null);

  if (typeof window === 'undefined') return;

  const { pathname, search } = window.location;
  if (isAuthPath(pathname)) return;

  window.location.href = getLoginPath(`${pathname}${search}`, QUERY_ACTION.VALUE.SESSION_EXPIRED);
};
