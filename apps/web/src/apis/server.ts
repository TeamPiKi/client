import { ERROR_CODE } from '@piki/core';
import type { AxiosError } from 'axios';
import axios from 'axios';

import { ENDPOINTS } from '@/consts/api';
import { QUERY_ACTION } from '@/consts/queryAction';
import { CLIENT_TYPE } from '@/consts/webBridge';
import type { ApiErrorResponseT } from '@/types/api';
import { captureApiError } from '@/utils/captureError';
import { getLoginPath } from '@/utils/loginRedirect';
import { isWebview } from '@/utils/webBridge';

// 서버 컴포넌트 전용 인스턴스
export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const isAuthRequest = (url?: string) => {
  const path = url?.split('?')[0] ?? '';

  return (
    path === ENDPOINTS.AUTH_TOKEN_REFRESH ||
    path === ENDPOINTS.AUTH_GUEST ||
    path.startsWith(ENDPOINTS.AUTH_LOGIN(''))
  );
};

serverApi.interceptors.request.use(async config => {
  const { cookies, headers } = await import('next/headers');

  if (!config.headers.Cookie) {
    const cookieStore = await cookies();
    config.headers.Cookie = cookieStore.toString();
  }

  const headerStore = await headers();
  const userAgent = headerStore.get('user-agent');
  config.headers['X-Client-Type'] = isWebview(userAgent) ? CLIENT_TYPE.APP : CLIENT_TYPE.WEB;

  return config;
});

serverApi.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorResponseT>) => {
    /** 401이면서 인증 경로가 아닌 경우 로그인 페이지로 리다이렉트  */
    if (error.response?.status === 401 && !isAuthRequest(error.config?.url)) {
      const { redirect } = await import('next/navigation');
      const { headers } = await import('next/headers');
      const redirectPath = (await headers()).get('x-redirect-path');

      redirect(getLoginPath(redirectPath, QUERY_ACTION.VALUE.SESSION_EXPIRED));
    }

    /** 탈퇴한 계정인 경우 로그아웃 후 로그인 페이지로 리다이렉트 */
    if (error.response?.status === 409 && error.response.data?.code === ERROR_CODE.USER_DELETED) {
      const { redirect } = await import('next/navigation');

      redirect(getLoginPath(null, QUERY_ACTION.VALUE.WITHDRAWN_ACCOUNT));
    }

    captureApiError(error, 'api-server');

    return Promise.reject(error);
  }
);
