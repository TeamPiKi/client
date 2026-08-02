import { ERROR_CODE } from '@piki/core';
import type { AxiosError } from 'axios';
import axios from 'axios';

import { QUERY_ACTION } from '@/consts/queryAction';
import { CLIENT_TYPE } from '@/consts/webBridge';
import type { ApiErrorResponseT } from '@/types/api';
import { captureError } from '@/utils/captureError';
import { getLoginPath } from '@/utils/loginRedirect';
import { isWebview } from '@/utils/webBridge';

// 서버 컴포넌트 전용 인스턴스
export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

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
    /** 탈퇴한 계정인 경우 로그아웃 후 로그인 페이지로 리다이렉트 */
    if (error.response?.status === 409 && error.response.data?.code === ERROR_CODE.USER_DELETED) {
      const { redirect } = await import('next/navigation');

      redirect(getLoginPath(null, QUERY_ACTION.VALUE.WITHDRAWN_ACCOUNT));
    }

    /** 5xx·네트워크 오류만 수집 (4xx는 예상된 흐름이라 제외) */
    const status = error.response?.status;
    const shouldReport =
      error.code !== 'ERR_CANCELED' &&
      (error.code === 'ERR_NETWORK' || (typeof status === 'number' && status >= 500));

    if (shouldReport) {
      const method = error.config?.method?.toUpperCase() ?? 'UNKNOWN';
      const path = error.config?.url?.split('?')[0] ?? 'unknown';

      /** 디코/대시보드 제목을 알아보기 쉽게 (원본 axios 정보는 extra 유지) */
      const apiError = new Error(`API ${status ?? error.code} ${method} ${path}`);
      apiError.name = 'ApiError';

      captureError(apiError, {
        tags: { source: 'api-server' },
        extra: {
          url: error.config?.url,
          method: error.config?.method,
          status,
          code: error.code,
          apiCode: error.response?.data?.code,
        },
      });
    }

    return Promise.reject(error);
  }
);
