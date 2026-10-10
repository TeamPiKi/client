import type { Page } from '@playwright/test';

import { createFakeJwt } from './fakeJwt';

export const EXPIRED_ACCESS_TOKEN_SUB = 'e2e-expired';

export const applyExpiredAccessToken = async (page: Page, role: 'GUEST' | 'MEMBER' = 'MEMBER') => {
  const cookie = { domain: 'localhost', path: '/' };

  await page.context().addCookies([
    { ...cookie, name: 'access_token', value: createFakeJwt(-60, role, EXPIRED_ACCESS_TOKEN_SUB) },
    { ...cookie, name: 'refresh_token', value: createFakeJwt(60 * 60, role) },
  ]);
};
