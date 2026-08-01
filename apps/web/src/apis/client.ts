import { ERROR_CODE, WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import * as Sentry from '@sentry/nextjs';
import type { AxiosError } from 'axios';
import axios from 'axios';

import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { CLIENT_TYPE } from '@/consts/webBridge';
import type { ApiErrorResponseT } from '@/types/api';
import { captureError } from '@/utils/captureError';
import { deleteCookie, getCookie } from '@/utils/cookie';
import { getLoginPath } from '@/utils/loginRedirect';
import { refreshClientToken } from '@/utils/refreshClientToken';
import { WebBridge, isWebview } from '@/utils/webBridge';

export const clientApi = axios.create({
  withCredentials: true,
});

clientApi.interceptors.request.use(config => {
  const accessToken = getCookie('access_token');
  const isApp = isWebview();

  if (isApp && accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

  config.headers['X-Client-Type'] = isApp ? CLIENT_TYPE.APP : CLIENT_TYPE.WEB;

  return config;
});

clientApi.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorResponseT>) => {
    const originalRequest = error.config;
    const hasRetried = originalRequest?.headers.get('x-retry-attempted') === 'true';

    if (error.response?.status === 401 && originalRequest && !hasRetried) {
      originalRequest.headers.set('x-retry-attempted', 'true');

      try {
        // 단일 진입점 — 동시 호출이라도 백엔드는 1번만 때리고 모두 같은 결과 공유.
        await refreshClientToken();
        return clientApi(originalRequest);
      } catch (refreshError) {
        /** 세션 만료 — Sentry 유저 컨텍스트 해제 */
        Sentry.setUser(null);

        if (typeof window !== 'undefined') {
          const loginRedirectDisabled =
            window.location.pathname === ROUTES.LOGIN ||
            window.location.pathname === ROUTES.ROOT ||
            /^\/auth\/callback\/[^/]+$/.test(window.location.pathname);

          if (!loginRedirectDisabled) {
            window.location.href = getLoginPath(
              `${window.location.pathname}${window.location.search}`,
              QUERY_ACTION.VALUE.SESSION_EXPIRED
            );
          }
        }
        return Promise.reject(refreshError);
      }
    }

    /** 탈퇴한 계정인 경우 로그아웃 후 로그인 페이지로 리다이렉트 */
    if (
      error.response?.status === 409 &&
      error.response.data?.code === ERROR_CODE.USER_DELETED &&
      typeof window !== 'undefined'
    ) {
      Sentry.setUser(null);
      deleteCookie('access_token');
      deleteCookie('refresh_token');

      if (isWebview()) WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_LOGOUT });

      const loginRedirectDisabled =
        window.location.pathname === ROUTES.LOGIN || window.location.pathname === ROUTES.ROOT;

      if (!loginRedirectDisabled)
        window.location.href = getLoginPath(null, QUERY_ACTION.VALUE.WITHDRAWN_ACCOUNT);

      return Promise.reject(error);
    }

    /** 5xx·네트워크 오류만 수집 (4xx는 예상된 흐름이라 제외) */
    const status = error.response?.status;
    const shouldReport =
      error.code !== 'ERR_CANCELED' &&
      (error.code === 'ERR_NETWORK' || (typeof status === 'number' && status >= 500));

    if (shouldReport) {
      const method = originalRequest?.method?.toUpperCase() ?? 'UNKNOWN';
      const path = originalRequest?.url?.split('?')[0] ?? 'unknown';

      /** 디코/대시보드 제목을 알아보기 쉽게 (원본 axios 정보는 extra 유지) */
      const apiError = new Error(`API ${status ?? error.code} ${method} ${path}`);
      apiError.name = 'ApiError';

      captureError(apiError, {
        tags: { source: 'api-client' },
        extra: {
          url: originalRequest?.url,
          method: originalRequest?.method,
          status,
          code: error.code,
          detail: error.response?.data?.detail,
        },
      });
    }

    return Promise.reject(error);
  }
);
