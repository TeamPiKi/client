import type { Route } from '@playwright/test';
import { test as base, expect } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import { createApiError, createApiSuccess } from '../helpers/apiResponse';
import { DEFAULT_MOCK_IMAGE, MOCK_IMAGE_MAP } from '../mocks/images';

type MockEntryT = {
  method: string;
  path: string;
  status: number;
  body: unknown;
};

type ApiErrorOptionsT = {
  status?: number;
  code?: string;
};

type PageResponseT = {
  nextCursor: string | null;
  hasNext: boolean;
};

export type ApiMockT = {
  get: <T>(path: string, data: T) => void;
  /** 커서 페이지네이션 응답 (`pageResponse` 최상위 필드 포함) — 위시리스트 등 */
  getPage: <T>(path: string, data: T, pageResponse?: PageResponseT) => void;
  post: <T>(path: string, data: T) => void;
  patch: <T>(path: string, data: T) => void;
  delete: <T>(path: string, data: T) => void;
  error: (
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    options?: ApiErrorOptionsT
  ) => void;
};

/**
 * page.route 기반 API 목킹 fixture.
 *
 * - `**\/api/v1/**` 라우트 하나를 선점하고 pathname(쿼리스트링 무시) + method 로 매칭한다.
 * - 사용 규칙: `api.get(...)` 등록 후 `page.goto(...)` 호출.
 * - 목킹되지 않은 /api/v1 요청은 500 으로 실패시키고 테스트 말미에 단언한다 — 누락 목 즉시 감지.
 * - SSR(serverApi·RSC 레이아웃) 요청은 브라우저 발이 아니라 여기서 못 잡는다.
 *   globalSetup 이 띄우는 목 스텁 서버(e2e/setup/mockApiServer.ts)가 대신 응답한다.
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

    /** 헤더 알림 아이콘(AlarmHeaderIcon)이 전 페이지에서 호출 — 빈 알림 기본 제공 */
    entries.push({
      method: 'GET',
      path: ENDPOINTS.NOTIFICATIONS,
      status: 200,
      body: {
        ...createApiSuccess({ items: [], unreadCount: 0 }),
        pageResponse: { nextCursor: null, hasNext: false },
      },
    });

    entries.push({
      method: 'GET',
      path: ENDPOINTS.WISHLISTS,
      status: 200,
      body: {
        ...createApiSuccess([]),
        pageResponse: { nextCursor: null, hasNext: false },
      },
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
          body: JSON.stringify({
            ...createApiError({ code: 'E2E_UNMOCKED' }),
            debug: `목킹되지 않은 요청: ${method} ${pathname}`,
          }),
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

    const fulfillMockImage = (route: Route, originalUrl: string) =>
      route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: MOCK_IMAGE_MAP[originalUrl] ?? DEFAULT_MOCK_IMAGE,
      });

    /**
     * next/image 최적화 요청(/_next/image?url=...) 인터셉트.
     * 외부 URL 이미지는 Next 서버가 서버사이드에서 원본을 fetch 하기 때문에 여기서
     * 서버 도달 전에 가로채 MOCK_IMAGE_MAP 의 로컬 이미지로 응답한다 (외부 접근 0).
     * 로컬(public/) 이미지는 그대로 통과시켜 dev 서버가 서빙한다.
     */
    await page.route('**/_next/image**', route => {
      const originalUrl = new URL(route.request().url()).searchParams.get('url') ?? '';
      if (!/^https?:\/\//.test(originalUrl)) return route.continue();
      return fulfillMockImage(route, originalUrl);
    });

    /** next/image 를 안 거치는 일반 <img> 가 가짜 CDN 주소를 직접 요청하는 경우 */
    await page.route('https://cdn.example/**', route =>
      fulfillMockImage(route, route.request().url())
    );

    /**
     * dev 전용 react-grab 오버레이(layout.tsx의 unpkg 스크립트) 차단.
     * - 주입된 오버레이가 trace 스냅샷 페인트를 통째로 막아 뷰어가 빈 화면이 된다
     * - 테스트 중 외부 CDN 의존 제거 (결정성). 프로덕션 빌드(CI)에는 원래 없음
     */
    await page.route('https://unpkg.com/**', route => route.abort());

    await provide({
      get: (path, data) =>
        entries.push({ method: 'GET', path, status: 200, body: createApiSuccess(data) }),
      getPage: (path, data, pageResponse) =>
        entries.push({
          method: 'GET',
          path,
          status: 200,
          body: {
            ...createApiSuccess(data),
            pageResponse: pageResponse ?? { nextCursor: null, hasNext: false },
          },
        }),
      post: (path, data) =>
        entries.push({ method: 'POST', path, status: 200, body: createApiSuccess(data) }),
      patch: (path, data) =>
        entries.push({ method: 'PATCH', path, status: 200, body: createApiSuccess(data) }),
      delete: (path, data) =>
        entries.push({ method: 'DELETE', path, status: 200, body: createApiSuccess(data) }),
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
