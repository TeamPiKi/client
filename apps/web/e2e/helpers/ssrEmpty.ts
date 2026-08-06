import type { Page } from '@playwright/test';

import { BASE_URL, SSR_EMPTY_COOKIE } from '../consts';

/**
 * 해당 경로의 SSR 응답을 빈 배열로 바꾼다 — `goto` 전에 호출.
 *
 * 서버 prefetch 와 클라이언트 훅의 쿼리키가 같으면 하이드레이션된 SSR 데이터가 그대로 쓰이고
 * (staleTime 내에는 재요청 없음), page.route 목은 아예 호출되지 않는다.
 * 따라서 'empty state' 류 테스트는 브라우저 목뿐 아니라 SSR 스텁도 비워야 한다.
 *
 * 쿠키는 Next 서버(serverApi 인터셉터)를 거쳐 스텁까지 전달되고 요청 단위로만 적용되므로
 * 워커 병렬 실행에도 테스트 간 간섭이 없다.
 */
export const setSsrEmpty = (page: Page, ...paths: string[]) =>
  page
    .context()
    .addCookies([
      { name: SSR_EMPTY_COOKIE, value: encodeURIComponent(paths.join(',')), url: BASE_URL },
    ]);
