import { test as setup } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { ONBOARDING_KEY } from '@/consts/onboarding';

import { BASE_URL } from '../consts';
import { createFakeJwt } from '../helpers/fakeJwt';

const AUTH_FILE = path.join(__dirname, '../../playwright/.auth/guest.json');

const TOKEN_TTL_SECONDS = 60 * 60;

setup('게스트 storageState 생성', async () => {
  const token = createFakeJwt(TOKEN_TTL_SECONDS);
  const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;

  const createCookie = (name: string) => ({
    name,
    value: token,
    domain: 'localhost',
    path: '/',
    expires,
    httpOnly: false,
    secure: false,
    sameSite: 'Lax' as const,
  });

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  fs.writeFileSync(
    AUTH_FILE,
    JSON.stringify(
      {
        cookies: [createCookie('access_token'), createCookie('refresh_token')],
        /** NOTE: 재방문 유저 기준으로 테스트. 온보딩 모달 생략 */
        origins: [{ origin: BASE_URL, localStorage: [{ name: ONBOARDING_KEY.HOME, value: '1' }] }],
      },
      null,
      2
    )
  );
});
