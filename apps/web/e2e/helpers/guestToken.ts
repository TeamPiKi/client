import type { Page } from '@playwright/test';

import { createFakeJwt } from './fakeJwt';

/** 기본 storageState(MEMBER)를 게스트 role 토큰으로 덮어써 서버 게이트를 게스트로 통과 */
export const useGuestToken = async (page: Page) => {
  const token = createFakeJwt(60 * 60, 'GUEST');
  const cookie = { domain: 'localhost', path: '/', value: token };

  await page.context().addCookies([
    { ...cookie, name: 'access_token' },
    { ...cookie, name: 'refresh_token' },
  ]);
};
