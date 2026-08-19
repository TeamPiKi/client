'use server';

import { cookies } from 'next/headers';

/** device_id 는 인증 정보가 아니라 FCM 기기 식별자 — 로그아웃 시 등록 해제에 쓰고 함께 정리한다 */
const CLEARED_COOKIE_NAMES = ['access_token', 'refresh_token', 'device_id'] as const;

/** 브라우저 httpOnly 인증 쿠키는 JS 로 지울 수 없어 서버 액션으로 폐기한다 */
export const clearAuthCookies = async () => {
  const cookieStore = await cookies();

  CLEARED_COOKIE_NAMES.forEach(cookieName => {
    if (cookieStore.has(cookieName)) cookieStore.delete(cookieName);
  });
};
