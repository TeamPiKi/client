import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

import { serverApi } from './server';

export const postTokenRefreshServer = async (cookies: string) => {
  const response = await serverApi.post<
    ApiResponseT<{ accessToken: string | null; refreshToken: string | null }>
  >(ENDPOINTS.AUTH_TOKEN_REFRESH, void 0, {
    headers: {
      Cookie: cookies,
      /** Refresh는 Content-Type 헤더 있으면 415 에러 발생 */
      'Content-Type': false,
    },
  });

  return response;
};
