import { type NextRequest, NextResponse } from 'next/server';

import { postTokenRefreshServer } from './apis/postTokenRefresh';
import { postGuestLoginServer } from './app/login/_apis/postGuestLogin';
import { isTokenValid } from './utils/auth';
import { getRouteType } from './utils/getRouteType';
import { getLoginPath } from './utils/loginRedirect';

const handleGuestLogin = async () => {
  const response = await postGuestLoginServer();
  const nextResponse = NextResponse.next();

  const setCookieHeader = response.headers['set-cookie'];
  setCookieHeader?.forEach(cookie => nextResponse.headers.append('set-cookie', cookie));

  return nextResponse;
};

/**
 * 같은 process 안에서 동일 refresh_token 으로 동시 호출되는 refresh 요청을 dedupe.
 *
 * 백엔드가 refresh_token rotation 정책(이전 토큰 즉시 무효) 을 쓰기 때문에,
 * 페이지 진입 시 RSC payload + page request 등 동시 다발 요청이 각자 refresh 를 호출하면
 * 첫 번째만 성공하고 두 번째부터 401 거부되어 사용자가 로그인 페이지로 튕긴다.
 *
 * key: refresh_token 값 그대로 사용 (다른 사용자는 다른 토큰)
 * value: 진행 중인 refresh 응답 Promise — 결과를 공유한다.
 *
 * 주의:
 *  - Edge runtime / serverless 환경에서는 process 가 짧게 살거나 인스턴스가 여러 개라
 *    완벽한 dedupe 은 불가. 그래도 대부분의 동시 요청은 동일 process 에서 발생하므로 효과적.
 *  - rotation 으로 새 토큰이 발급되면 다음 호출은 새 key 라 자동으로 새 entry 생성.
 *  - finally 에서 entry 를 제거해 메모리 누수 방지.
 */
const inflightRefreshByToken = new Map<
  string,
  Promise<Awaited<ReturnType<typeof postTokenRefreshServer>>>
>();

const refreshTokenDedupe = (refreshToken: string, cookieHeader: string) => {
  const existing = inflightRefreshByToken.get(refreshToken);
  if (existing) return existing;

  const promise = postTokenRefreshServer(cookieHeader).finally(() => {
    inflightRefreshByToken.delete(refreshToken);
  });
  inflightRefreshByToken.set(refreshToken, promise);
  return promise;
};

const handleTokenRefresh = async (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;

  const cookieMap = new Map(
    request.cookies.getAll().map(cookie => [cookie.name, cookie.value] as const)
  );
  const cookieHeader = [...cookieMap.entries()]
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
  const refreshTokenValue = cookieMap.get('refresh_token') ?? '';

  try {
    /**
     * 토큰 갱신 요청
     * - 동일 refresh_token 에 대한 동시 호출은 한 번만 백엔드를 때리고 결과를 공유 (rotation 대응)
     */
    const response = await refreshTokenDedupe(refreshTokenValue, cookieHeader);

    /**
     * 페이지 요청에서는 쿠키 옵션을 필요로 하지 않음
     * 쿠키 옵션 제거 후 key, value만 추출하여 페이지로 전달
     */
    const setCookieHeaders = response.headers['set-cookie'] ?? [];
    setCookieHeaders.forEach(setCookie => {
      const nameValue = setCookie.split(';')[0] ?? '';
      const separatorIndex = nameValue.indexOf('=');
      if (separatorIndex === -1) return;

      const name = nameValue.slice(0, separatorIndex).trim();
      const value = nameValue.slice(separatorIndex + 1).trim();
      cookieMap.set(name, value);
    });

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(
      'cookie',
      [...cookieMap.entries()].map(([name, value]) => `${name}=${value}`).join('; ')
    );

    if (getRouteType(pathname) === 'MEMBER_ONLY')
      requestHeaders.set('x-redirect-path', `${pathname}${search}`);

    /** 갱신된 쿠키 페이지 요청에 전달 */
    const nextResponse = NextResponse.next({ request: { headers: requestHeaders } });

    /** 서버에서 받아온 쿠키 브라우저에 저장 */
    setCookieHeaders.forEach(cookie => nextResponse.headers.append('set-cookie', cookie));

    return nextResponse;
  } catch {
    return NextResponse.redirect(new URL(getLoginPath(`${pathname}${search}`), request.url));
  }
};

export const proxy = async (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;

  const routeType = getRouteType(pathname);

  if (!routeType) return NextResponse.next();

  /** 퍼블릭 영역 */
  if (routeType === 'PUBLIC') return NextResponse.next();

  /** 멤버 및 게스트 공통 영역 */
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');

  if (routeType === 'MEMBER_AND_GUEST') {
    /** access(O): 통과 */
    if (accessToken && isTokenValid(accessToken.value)) return NextResponse.next();

    /** access(X), refresh(O): 토큰 갱신, 실패 시 로그인 페이지로 리다이렉트 */
    if (refreshToken) return await handleTokenRefresh(request);

    /** access(X), refresh(X): 자동 게스트 로그인 */
    return await handleGuestLogin();
  }

  if (routeType === 'MEMBER_ONLY' || routeType === 'AUTHORIZED') {
    /** access(O): 통과, 헤더에 쿼리파라미터까지 포함된 이동 경로 주입 */
    if (accessToken && isTokenValid(accessToken.value)) {
      const headers = new Headers(request.headers);
      headers.set('x-redirect-path', `${pathname}${search}`);
      return NextResponse.next({ request: { headers } });
    }

    /** access(X), refresh(O): 토큰 갱신, 실패 시 로그인 페이지로 리다이렉트 */
    if (refreshToken) return await handleTokenRefresh(request);

    /** access(X), refresh(X): 로그인 페이지로 리다이렉트 */
    return NextResponse.redirect(new URL(getLoginPath(`${pathname}${search}`), request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
