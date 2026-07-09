import { expect, test as base } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import { createApiError, createApiSuccess } from '../helpers/apiResponse';

type MockEntryT = {
  method: string;
  path: string;
  status: number;
  body: unknown;
};

type ApiErrorOptionsT = {
  status?: number;
  detail?: string;
  code?: string;
};

export type ApiMockT = {
  get: <T>(path: string, data: T) => void;
  post: <T>(path: string, data: T) => void;
  error: (method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, options?: ApiErrorOptionsT) => void;
};

/**
 * page.route 기반 API 목킹 fixture.
 *
 * - `**\/api/v1/**` 라우트 하나를 선점하고 pathname(쿼리스트링 무시) + method 로 매칭한다.
 * - 사용 규칙: `api.get(...)` 등록 후 `page.goto(...)` 호출.
 * - 목킹되지 않은 /api/v1 요청은 500 으로 실패시키고 테스트 말미에 단언한다 — 누락 목 즉시 감지.
 * - SSR(serverApi) 요청은 브라우저 발이 아니라 여기서 못 잡는다. playwright.config.ts 가
 *   NEXT_PUBLIC_API_URL 을 죽은 주소로 강제해 SSR prefetch 는 조용히 실패하고,
 *   클라이언트 재요청이 이 목으로 처리된다.
 */
export const test = base.extend<{ api: ApiMockT }>({
  /** 2번째 인자는 Playwright fixture 의 use — react-hooks lint 오인을 피해 provide 로 명명 */
  api: async ({ page }, provide) => {
    const entries: MockEntryT[] = [];
    const unmocked: string[] = [];

    /** 401 시 axios interceptor 의 토큰 갱신 요청이 실패 루프를 타지 않도록 기본 제공 */
    entries.push({
      method: 'POST',
      path: ENDPOINTS.AUTH_TOKEN_REFRESH,
      status: 200,
      body: createApiSuccess({ access_token: null, refresh_token: null }),
    });

    await page.route('**/api/v1/**', route => {
      const { pathname } = new URL(route.request().url());
      const method = route.request().method();
      const entry = [...entries].reverse().find(e => e.method === method && e.path === pathname);

      if (!entry) {
        unmocked.push(`${method} ${pathname}`);
        return route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify(
            createApiError({
              status: 500,
              code: 'E2E_UNMOCKED',
              detail: `목킹되지 않은 요청: ${method} ${pathname}`,
            })
          ),
        });
      }

      return route.fulfill({
        status: entry.status,
        contentType: 'application/json',
        body: JSON.stringify(entry.body),
      });
    });

    /** 알림 SSE(Next Route Handler — /api/v1 아님): 빈 스트림으로 응답해 upstream 접근 차단 */
    await page.route('**/api/notifications/subscribe', route =>
      route.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream' }, body: '' })
    );

    await provide({
      get: (path, data) =>
        entries.push({ method: 'GET', path, status: 200, body: createApiSuccess(data) }),
      post: (path, data) =>
        entries.push({ method: 'POST', path, status: 200, body: createApiSuccess(data) }),
      error: (method, path, options) =>
        entries.push({
          method,
          path,
          status: options?.status ?? 400,
          body: createApiError(options),
        }),
    });

    expect(unmocked, `목킹되지 않은 API 요청:\n${unmocked.join('\n')}`).toEqual([]);
  },
});

export { expect };
