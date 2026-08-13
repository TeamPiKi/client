'use server';

import { cookies } from 'next/headers';

const AUTH_COOKIE_NAMES = ['access_token', 'refresh_token', 'device_id'] as const;

/** 브라우저 httpOnly 인증 쿠키는 JS 로 지울 수 없어 서버 액션으로 폐기한다 */
export const clearAuthCookies = async () => {
  const cookieStore = await cookies();

  AUTH_COOKIE_NAMES.forEach(cookieName => {
    if (cookieStore.has(cookieName)) cookieStore.delete(cookieName);
  });
};
