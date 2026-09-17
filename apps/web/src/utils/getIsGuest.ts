import { cookies } from 'next/headers';

import { getRoleFromToken } from '@/utils/auth';

/** RSC 전용. access_token 쿠키에서 역할을 읽어 게스트 여부를 반환한다. */
export const getIsGuest = async (): Promise<boolean> => {
  const token = (await cookies()).get('access_token')?.value;
  return getRoleFromToken(token) === 'GUEST';
};
