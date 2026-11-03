import type { APIResponse } from '@playwright/test';

import { expect, test } from '@e2e/fixtures/mockApiFixture';

/** Location 은 상대 경로일 수 있어 요청 URL 기준으로 해석 */
const getRedirectTarget = (response: APIResponse) => {
  const { origin, pathname } = new URL(response.headers()['location'] ?? '', response.url());
  return { origin, pathname };
};

/** 구버전 앱 공유 시트가 /archive/wish 로 진입하므로 옛 경로는 영구 리다이렉트로 받는다 */
test('옛 위시 목록 경로는 /wish 로 영구 리다이렉트한다', async ({ page }) => {
  const response = await page.request.get('/archive/wish', { maxRedirects: 0 });

  expect(response.status()).toBe(308);
  expect(getRedirectTarget(response)).toEqual({
    origin: new URL(response.url()).origin,
    pathname: '/wish',
  });
});

test('옛 위시 상세 경로는 /wish/:id 로 영구 리다이렉트한다', async ({ page }) => {
  const response = await page.request.get('/archive/wish/12', { maxRedirects: 0 });

  expect(response.status()).toBe(308);
  expect(getRedirectTarget(response)).toEqual({
    origin: new URL(response.url()).origin,
    pathname: '/wish/12',
  });
});
