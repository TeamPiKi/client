'use server';

import { cookies } from 'next/headers';

import { deleteFcmToken } from '@/apis/deleteFcmToken';
import { serverApi } from '@/apis/server';
import { clearAuthCookies } from '@/app/mypage/_common/_actions/clearAuthCookies';
import { ENDPOINTS } from '@/consts/api';

export const logout = async () => {
  const cookieStore = await cookies();
  const deviceId = cookieStore.get('device_id')?.value;

  if (deviceId) {
    try {
      await deleteFcmToken(deviceId);
    } catch {
      // FCM 토큰 해제 실패해도 로그아웃 진행
    }
  }

  try {
    await serverApi.post(ENDPOINTS.AUTH_LOGOUT); //  TODO: 중복 호출 수정하기
  } catch {
    // 백엔드 실패해도 로컬 쿠키는 삭제
  }

  await clearAuthCookies();
};
