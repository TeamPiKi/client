import type { Page } from '@playwright/test';

import { BASE_URL, SSR_STATUS_COOKIE } from '../consts';

/** SSR 스텁의 한 라우트를 지정 status 의 에러로 응답하게 한다 — `goto` 전에 호출. routeKey 는 `POST /path` 형식 */
export const setSsrStatus = (page: Page, routeKey: string, status: number) =>
  page.context().addCookies([
    {
      name: SSR_STATUS_COOKIE,
      value: encodeURIComponent(`${routeKey}=${status}`),
      url: BASE_URL,
    },
  ]);
