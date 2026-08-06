import http from 'node:http';

import { ENDPOINTS } from '@/consts/api';

import { SSR_EMPTY_COOKIE } from '../consts';
import { createApiError, createApiSuccess } from '../helpers/apiResponse';
import { MOCK_MEMBER_ME } from '../mocks/me';
import {
  MOCK_TOURNAMENT_COMPLETED,
  MOCK_TOURNAMENT_IN_PROGRESS,
  MOCK_TOURNAMENT_LIST,
  MOCK_TOURNAMENT_PENDING,
  MOCK_TOURNAMENT_PENDING_1ITEM,
  MOCK_TOURNAMENT_PENDING_3ITEMS,
  MOCK_TOURNAMENT_PENDING_4ITEMS,
} from '../mocks/tournament';

/**
 * SSR(serverApi·RSC 레이아웃) 발 API 요청을 받아주는 목 스텁 서버 — node:http 내장만 사용.
 *
 * page.route 는 브라우저 발 요청만 가로챌 수 있는데, tournament/[id]/layout.tsx 처럼
 * RSC 가 직접 await 하는 요청(접근 권한 확인)은 서버에서 나가므로 이 스텁이 응답한다.
 * 목 데이터는 e2e/mocks 상수를 page.route fixture 와 공유한다 — 단일 소스.
 *
 * 등록되지 않은 경로는 404 에러 규약으로 응답한다 — prefetchQuery 는 조용히 실패하고
 * 클라이언트 재요청이 page.route 목으로 처리되므로 결정성이 유지된다.
 */
const SSR_MOCK_ROUTES: Record<string, unknown> = {
  /**
   * 유저는 회원으로 고정 — 서비스 주 타겟이 회원이고, 회원 전용 UI(위시에서 가져오기 등)
   * 를 E2E 로 검증하기 위함. 'me' 는 RSC 가 pending 상태로 dehydrate 하므로
   * (create/page.tsx 등) 브라우저 목으로는 테스트별 덮어쓰기가 불가하다 —
   * 게스트 전용 플로우 검증이 필요해지면 별도 전략(라우트 분리 등)이 필요하다.
   */
  [`GET ${ENDPOINTS.USER}`]: createApiSuccess(MOCK_MEMBER_ME),
  [`GET ${ENDPOINTS.TOURNAMENTS}`]: createApiSuccess(MOCK_TOURNAMENT_LIST),
  /** 상태 전이는 SSR 목으로 표현 불가(경로당 고정 응답) — 상태·개수 변형마다 토너먼트 id 를 분리한다 */
  [`GET ${ENDPOINTS.TOURNAMENT(1)}`]: createApiSuccess(MOCK_TOURNAMENT_PENDING),
  [`GET ${ENDPOINTS.TOURNAMENT(2)}`]: createApiSuccess(MOCK_TOURNAMENT_IN_PROGRESS),
  [`GET ${ENDPOINTS.TOURNAMENT(3)}`]: createApiSuccess(MOCK_TOURNAMENT_COMPLETED),
  [`GET ${ENDPOINTS.TOURNAMENT(11)}`]: createApiSuccess(MOCK_TOURNAMENT_PENDING_1ITEM),
  [`GET ${ENDPOINTS.TOURNAMENT(13)}`]: createApiSuccess(MOCK_TOURNAMENT_PENDING_3ITEMS),
  [`GET ${ENDPOINTS.TOURNAMENT(14)}`]: createApiSuccess(MOCK_TOURNAMENT_PENDING_4ITEMS),
  [`GET ${ENDPOINTS.NOTIFICATIONS}`]: {
    ...createApiSuccess({ items: [], unreadCount: 0 }),
    pageResponse: { nextCursor: null, hasNext: false },
  },
};

/**
 * 테스트가 `setSsrEmpty` 로 심은 쿠키에 이 경로가 있으면 빈 목록을 응답한다.
 * 조회(GET)에만 적용한다 — 같은 경로의 POST 등 다른 메서드까지 빈 응답이 되면 안 된다.
 */
const isEmptyRequested = (req: http.IncomingMessage, pathname: string) => {
  if (req.method !== 'GET') return false;

  const cookie = req.headers.cookie
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${SSR_EMPTY_COOKIE}=`));

  if (!cookie) return false;

  return decodeURIComponent(cookie.slice(SSR_EMPTY_COOKIE.length + 1))
    .split(',')
    .includes(pathname);
};

/**
 * 스텁 서버를 띄운다. 이미 다른 세션(UI 모드 등)이 같은 포트에 띄워둔 경우
 * null 을 반환하고 기존 서버를 재사용한다 — UI 모드를 켜둔 채 CLI 실행 시 크래시 방지.
 */
export const startMockApiServer = (port: number) =>
  new Promise<http.Server | null>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const pathname = new URL(req.url ?? '/', `http://127.0.0.1:${port}`).pathname;
      const body = isEmptyRequested(req, pathname)
        ? createApiSuccess([])
        : SSR_MOCK_ROUTES[`${req.method} ${pathname}`];

      if (!body) {
        res.writeHead(404, { 'content-type': 'application/json' });
        res.end(
          JSON.stringify(
            createApiError({
              status: 404,
              code: 'E2E_SSR_UNMOCKED',
              detail: `SSR 목 스텁에 등록되지 않은 요청: ${req.method} ${pathname}`,
            })
          )
        );
        return;
      }

      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(body));
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') resolve(null);
      else reject(error);
    });

    server.listen(port, '127.0.0.1', () => resolve(server));
  });
