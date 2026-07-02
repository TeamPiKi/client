import type { AxiosError } from 'axios';
import axios from 'axios';

import { CLIENT_TYPE } from '@/consts/webBridge';
import type { ApiErrorResponseT } from '@/types/api';
import { captureError } from '@/utils/captureError';
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
  (error: AxiosError<ApiErrorResponseT>) => {
    /** 5xx·네트워크 오류만 수집 (4xx는 예상된 흐름이라 제외) */
    const status = error.response?.status;
    const shouldReport =
      error.code !== 'ERR_CANCELED' &&
      (error.code === 'ERR_NETWORK' || (typeof status === 'number' && status >= 500));

    if (shouldReport) {
      captureError(error, {
        tags: { source: 'api-server' },
        extra: {
          url: error.config?.url,
          method: error.config?.method,
          status,
          code: error.code,
          detail: error.response?.data?.detail,
        },
      });
    }

    return Promise.reject(error);
  }
);
