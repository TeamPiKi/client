import * as Sentry from '@sentry/nextjs';

import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { clearAuthSession } from '@/utils/clearAuthSession';
import { getLoginPath } from '@/utils/loginRedirect';

/** 로그인 진행 중인 경로 — 세션 만료로 다시 로그인으로 보내면 자기 자신 루프 */
const isAuthPath = (pathname: string) =>
  pathname === ROUTES.LOGIN ||
  pathname === ROUTES.ROOT ||
  /^\/auth\/callback\/[^/]+$/.test(pathname);

/** 소셜 로그인 코드 교환 중 — 곧 새 토큰이 발급되므로 폐기하면 로그인 자체가 깨진다 */
const isTokenExchangePath = (pathname: string) => /^\/auth\/callback\/[^/]+$/.test(pathname);

/** 클라이언트 세션 만료 처리 — refresh 로 세션을 이어갈 수 없을 때의 단일 진입점 */
export const handleSessionExpired = () => {
  Sentry.setUser(null);

  if (typeof window === 'undefined') return;

  const { pathname, search } = window.location;

  /**
   * 인증 경로는 리다이렉트하면 자기 자신 루프라 폐기만 한다.
   * 폐기까지 건너뛰면 죽은 쿠키가 남아 다음 진입에서 멤버로 오인돼 홈으로 되돌려진다.
   */
  if (isAuthPath(pathname)) {
    if (isTokenExchangePath(pathname)) return;

    void clearAuthSession();

    return;
  }

  window.location.href = getLoginPath(`${pathname}${search}`, QUERY_ACTION.VALUE.SESSION_EXPIRED);
};
