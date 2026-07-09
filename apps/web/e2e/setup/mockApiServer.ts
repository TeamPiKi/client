import http from 'node:http';

import { ENDPOINTS } from '@/consts/api';

import { createApiError, createApiSuccess } from '../helpers/apiResponse';
import { MOCK_GUEST_ME } from '../mocks/me';
import { MOCK_TOURNAMENT_LIST, MOCK_TOURNAMENT_PENDING } from '../mocks/tournament';

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
  [`GET ${ENDPOINTS.USER}`]: createApiSuccess(MOCK_GUEST_ME),
  [`GET ${ENDPOINTS.TOURNAMENTS}`]: createApiSuccess(MOCK_TOURNAMENT_LIST),
  [`GET ${ENDPOINTS.TOURNAMENT(1)}`]: createApiSuccess(MOCK_TOURNAMENT_PENDING),
  [`GET ${ENDPOINTS.NOTIFICATIONS}`]: {
    ...createApiSuccess({ items: [], unreadCount: 0 }),
    pageResponse: { nextCursor: null, hasNext: false },
  },
};

export const startMockApiServer = (port: number) =>
  new Promise<http.Server>(resolve => {
    const server = http.createServer((req, res) => {
      const pathname = new URL(req.url ?? '/', `http://127.0.0.1:${port}`).pathname;
      const body = SSR_MOCK_ROUTES[`${req.method} ${pathname}`];

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

    server.listen(port, '127.0.0.1', () => resolve(server));
  });
