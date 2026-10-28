import { ERROR_CODE, WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import * as Sentry from '@sentry/nextjs';
import type { AxiosError } from 'axios';
import axios from 'axios';

import { ENDPOINTS } from '@/consts/api';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { CLIENT_TYPE } from '@/consts/webBridge';
import type { ApiErrorResponseT } from '@/types/api';
import { captureApiError } from '@/utils/captureError';
import { deleteCookie, getCookie } from '@/utils/cookie';
import { handleSessionExpired } from '@/utils/handleSessionExpired';
import { getLoginPath } from '@/utils/loginRedirect';
import { refreshClientToken } from '@/utils/refreshClientToken';
import { WebBridge, isWebview } from '@/utils/webBridge';

export const clientApi = axios.create({
  withCredentials: true,
});

/** 로그인 요청 — 아직 세션이 없어 refresh 가 성공할 수 없고, 401 도 세션 만료가 아니라 로그인 실패다 */
const isLoginRequest = (url?: string) => {
  const path = url?.split('?')[0] ?? '';

  return path.startsWith(ENDPOINTS.AUTH_LOGIN('')) || path === ENDPOINTS.AUTH_GUEST;
};

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

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !hasRetried &&
      !isLoginRequest(originalRequest.url)
    ) {
      originalRequest.headers.set('x-retry-attempted', 'true');

      try {
        // 단일 진입점 — 동시 호출이라도 백엔드는 1번만 때리고 모두 같은 결과 공유.
        await refreshClientToken();
        return clientApi(originalRequest);
      } catch (refreshError) {
        handleSessionExpired();
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

    captureApiError(error, 'api-client');

    return Promise.reject(error);
  }
);
