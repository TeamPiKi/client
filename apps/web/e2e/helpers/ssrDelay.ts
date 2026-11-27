import type { Page } from '@playwright/test';

import { BASE_URL, SSR_DELAY_COOKIE } from '../consts';

/** SSR 스텁의 한 라우트 응답을 ms 만큼 늦춘다 — 로딩 화면 검증용, `goto` 전에 호출. routeKey 는 `GET /path` 형식 */
export const setSsrDelay = (page: Page, routeKey: string, delayMs: number) =>
  page.context().addCookies([
    {
      name: SSR_DELAY_COOKIE,
      value: encodeURIComponent(`${routeKey}=${delayMs}`),
      url: BASE_URL,
    },
  ]);
