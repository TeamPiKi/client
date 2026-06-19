import type { AxiosError } from 'axios';
import axios from 'axios';

import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { CLIENT_TYPE } from '@/consts/webBridge';
import type { ApiErrorResponseT } from '@/types/api';
import { getCookie } from '@/utils/cookie';
import { getLoginPath } from '@/utils/loginRedirect';
import { refreshClientToken } from '@/utils/refreshClientToken';
import { isWebview } from '@/utils/webBridge';

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

    return Promise.reject(error);
  }
);
