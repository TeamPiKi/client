import http from 'node:http';

import { ENDPOINTS } from '@/consts/api';

import { SSR_EMPTY_COOKIE, SSR_STATUS_COOKIE } from '../consts';
import { createApiError, createApiSuccess } from '../helpers/apiResponse';
import { createFakeJwt } from '../helpers/fakeJwt';
import { REFRESHED_BODY_TOKEN_SUB, REFRESHED_COOKIE_TOKEN_SUB } from '../mocks/auth';
import { MOCK_GUEST_ME, MOCK_MEMBER_ME } from '../mocks/me';
import {
  MOCK_INVITE_PREVIEW,
  MOCK_TOURNAMENT_COMPLETED,
  MOCK_TOURNAMENT_GROUP_COMPLETED,
  MOCK_TOURNAMENT_IN_PROGRESS,
  MOCK_TOURNAMENT_LIST,
  MOCK_TOURNAMENT_PENDING,
  MOCK_TOURNAMENT_PENDING_1ITEM,
  MOCK_TOURNAMENT_PENDING_3ITEMS,
  MOCK_TOURNAMENT_PENDING_4ITEMS,
} from '../mocks/tournament';
import { MOCK_WISHLIST_ENTRIES, MOCK_WISH_DETAIL } from '../mocks/wish';

/**
 * SSR(serverApi·RSC 레이아웃·미들웨어) 발 API 요청을 받아주는 목 스텁 서버 — node:http 내장만 사용.
 *
 * page.route 는 브라우저 발 요청만 가로챌 수 있는데, tournament/[id]/layout.tsx 처럼
 * RSC 가 직접 await 하는 요청(접근 권한 확인)은 서버에서 나가므로 이 스텁이 응답한다.
 * 목 데이터는 e2e/mocks 상수를 page.route fixture 와 공유한다 — 단일 소스.
 *
 * 등록되지 않은 경로는 404 에러 규약으로 응답한다 — prefetchQuery 는 조용히 실패하고
 * 클라이언트 재요청이 page.route 목으로 처리되므로 결정성이 유지된다.
 */
const SSR_MOCK_ROUTES: Record<string, unknown> = {
  [`GET ${ENDPOINTS.TOURNAMENTS}`]: createApiSuccess(MOCK_TOURNAMENT_LIST),
  /** 상태 전이는 SSR 목으로 표현 불가(경로당 고정 응답) — 상태·개수 변형마다 토너먼트 id 를 분리한다 */
  [`GET ${ENDPOINTS.TOURNAMENT(1)}`]: createApiSuccess(MOCK_TOURNAMENT_PENDING),
  [`GET ${ENDPOINTS.TOURNAMENT(2)}`]: createApiSuccess(MOCK_TOURNAMENT_IN_PROGRESS),
  [`GET ${ENDPOINTS.TOURNAMENT(3)}`]: createApiSuccess(MOCK_TOURNAMENT_COMPLETED),
  [`GET ${ENDPOINTS.TOURNAMENT(4)}`]: createApiSuccess(MOCK_TOURNAMENT_GROUP_COMPLETED),
  [`GET ${ENDPOINTS.TOURNAMENT(11)}`]: createApiSuccess(MOCK_TOURNAMENT_PENDING_1ITEM),
  [`GET ${ENDPOINTS.TOURNAMENT(13)}`]: createApiSuccess(MOCK_TOURNAMENT_PENDING_3ITEMS),
  [`GET ${ENDPOINTS.TOURNAMENT(14)}`]: createApiSuccess(MOCK_TOURNAMENT_PENDING_4ITEMS),
  /** 요청의 ?code= 는 무시된다 — 스텁은 pathname 만 매칭 */
  [`GET ${ENDPOINTS.TOURNAMENT_INVITE_PREVIEW_BY_CODE}`]: createApiSuccess(MOCK_INVITE_PREVIEW),
  [`GET ${ENDPOINTS.NOTIFICATIONS}`]: {
    ...createApiSuccess({ items: [], unreadCount: 0 }),
    pageResponse: { nextCursor: null, hasNext: false },
  },
  [`GET ${ENDPOINTS.WISHLISTS}`]: createApiSuccess(MOCK_WISHLIST_ENTRIES),
  [`GET ${ENDPOINTS.WISHLIST(1)}`]: createApiSuccess(MOCK_WISH_DETAIL),
};

const readCookie = (req: http.IncomingMessage, name: string) =>
  req.headers.cookie
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);

const readTokenRole = (req: http.IncomingMessage, cookieName: string): 'GUEST' | 'MEMBER' => {
  const token = readCookie(req, cookieName);

  try {
    const payload = JSON.parse(Buffer.from(token?.split('.')[1] ?? '', 'base64url').toString());
    return payload.role === 'GUEST' ? 'GUEST' : 'MEMBER';
  } catch {
    return 'MEMBER';
  }
};

/**
 * me 는 요청 토큰(access_token 쿠키)의 role 클레임과 정합시킨다 — 서버 게이트 판정과 me 응답이
 * 항상 같은 유저를 가리키도록. 'me' 는 루트 layout 이 pending 으로 dehydrate 해 브라우저 목으로
 * 테스트별 덮어쓰기가 불가하므로, `applyGuestToken` 이 심은 게스트 토큰이 곧 게스트 me 가 된다.
 */
const resolveMe = (req: http.IncomingMessage) =>
  createApiSuccess(readTokenRole(req, 'access_token') === 'GUEST' ? MOCK_GUEST_ME : MOCK_MEMBER_ME);

/**
 * 테스트가 `setSsrEmpty` 로 심은 쿠키에 이 경로가 있으면 빈 목록을 응답한다.
 * 조회(GET)에만 적용한다 — 같은 경로의 POST 등 다른 메서드까지 빈 응답이 되면 안 된다.
 */
const isEmptyRequested = (req: http.IncomingMessage, pathname: string) => {
  if (req.method !== 'GET') return false;

  const cookie = readCookie(req, SSR_EMPTY_COOKIE);
  if (!cookie) return false;

  return decodeURIComponent(cookie).split(',').includes(pathname);
};

/** 테스트가 `setSsrStatus` 로 심은 쿠키가 이 라우트를 가리키면 그 status — 라우트 등록 여부와 무관 */
const readStatusOverride = (req: http.IncomingMessage, routeKey: string): number | null => {
  const cookie = readCookie(req, SSR_STATUS_COOKIE);
  if (!cookie) return null;

  const [overriddenRouteKey, status] = decodeURIComponent(cookie).split('=');
  if (overriddenRouteKey !== routeKey) return null;

  const parsedStatus = Number(status);
  return Number.isInteger(parsedStatus) ? parsedStatus : null;
};

const TOKEN_TTL_SECONDS = 60 * 60;

/** 백엔드는 web 에 Set-Cookie 로, app 에 body 로 토큰을 준다 */
const respondRefreshedTokens = (req: http.IncomingMessage, res: http.ServerResponse) => {
  const role = readTokenRole(req, 'refresh_token');
  const cookieToken = () => createFakeJwt(TOKEN_TTL_SECONDS, role, REFRESHED_COOKIE_TOKEN_SUB);
  const bodyToken = () => createFakeJwt(TOKEN_TTL_SECONDS, role, REFRESHED_BODY_TOKEN_SUB);
  const cookieOptions = `Path=/; SameSite=Lax; Max-Age=${TOKEN_TTL_SECONDS}`;

  res.writeHead(200, {
    'content-type': 'application/json',
    'set-cookie': [
      `access_token=${cookieToken()}; ${cookieOptions}`,
      `refresh_token=${cookieToken()}; ${cookieOptions}`,
    ],
  });
  res.end(
    JSON.stringify(createApiSuccess({ accessToken: bodyToken(), refreshToken: bodyToken() }))
  );
};

const respondJson = (res: http.ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
};

/**
 * 스텁 서버를 띄운다. 이미 다른 세션(UI 모드 등)이 같은 포트에 띄워둔 경우
 * null 을 반환하고 기존 서버를 재사용한다 — UI 모드를 켜둔 채 CLI 실행 시 크래시 방지.
 */
export const startMockApiServer = (port: number) =>
  new Promise<http.Server | null>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const pathname = new URL(req.url ?? '/', `http://127.0.0.1:${port}`).pathname;
      const routeKey = `${req.method} ${pathname}`;

      const statusOverride = readStatusOverride(req, routeKey);
      if (statusOverride !== null)
        return respondJson(res, statusOverride, createApiError({ code: 'E2E_SSR_STATUS' }));

      if (routeKey === `POST ${ENDPOINTS.AUTH_TOKEN_REFRESH}`)
        return respondRefreshedTokens(req, res);
      if (routeKey === `GET ${ENDPOINTS.USER}`) return respondJson(res, 200, resolveMe(req));
      if (isEmptyRequested(req, pathname)) return respondJson(res, 200, createApiSuccess([]));

      if (!(routeKey in SSR_MOCK_ROUTES)) {
        return respondJson(res, 404, {
          ...createApiError({ code: 'E2E_SSR_UNMOCKED' }),
          debug: `SSR 목 스텁에 등록되지 않은 요청: ${routeKey}`,
        });
      }

      return respondJson(res, 200, SSR_MOCK_ROUTES[routeKey]);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') resolve(null);
      else reject(error);
    });

    server.listen(port, '127.0.0.1', () => resolve(server));
  });
