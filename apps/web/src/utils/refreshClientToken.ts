import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import axios from 'axios';

import { ENDPOINTS } from '@/consts/api';
import { CLIENT_TYPE } from '@/consts/webBridge';

import { setCookie } from './cookie';
import { WebBridge, isWebview } from './webBridge';

/**
 * 클라이언트 측 토큰 갱신 — 모든 클라 코드(axios interceptor / SSE / 그 외)는
 * 직접 `/auth/token/refresh` 를 호출하지 말고 이 함수만 사용한다.
 *
 * 왜 단일 진입점?
 *  - 백엔드의 refresh_token rotation 정책: 호출 즉시 이전 refresh_token 무효화
 *  - 여러 경로에서 거의 동시에 refresh 를 호출하면 첫 번째만 성공, 나머지는 401/500 받음
 *  - 같은 process 안에서는 진행 중인 refresh 가 있으면 그 Promise 를 공유해
 *    백엔드를 한 번만 때리도록 dedupe 한다.
 *
 * 동작 보장:
 *  - 동시 N개 호출 → 백엔드 호출 1번, 모두 같은 결과 (성공/실패) 공유
 *  - 호출 완료 후 inflight 비워서 다음 라운드는 새 호출
 *  - 웹뷰: 응답 body 의 토큰을 쿠키에도 저장 (네이티브와 동기화)
 *  - 일반 브라우저: 백엔드의 Set-Cookie 헤더가 자동으로 적용됨
 *
 * Content-Type 헤더 제거 이유:
 *  - body 없는 POST 에 Content-Type: application/json 이 붙으면 백엔드가
 *    "body 우선 검증" 하다가 refreshToken 필드 누락으로 400 거부.
 *  - axios 의 false 트릭으로 헤더 자체를 빼면 백엔드가 쿠키만 보고 처리.
 */

type RefreshResponseT = {
  data: {
    access_token: string | null;
    refresh_token: string | null;
  };
};

let inflightRefresh: Promise<void> | null = null;

const performRefresh = async (): Promise<void> => {
  const { data } = await axios.post<RefreshResponseT>(ENDPOINTS.AUTH_TOKEN_REFRESH, void 0, {
    withCredentials: true,
    headers: {
      'Content-Type': false as unknown as string,
      'X-Client-Type': isWebview() ? CLIENT_TYPE.APP : CLIENT_TYPE.WEB,
    },
  });

  // 웹뷰는 백엔드 Set-Cookie 가 그대로 안 박히는 케이스가 있어 응답 body 의 토큰을 직접 저장.
  if (isWebview()) {
    const { access_token: newAccessToken, refresh_token: newRefreshToken } = data.data;
    if (newAccessToken && newRefreshToken) {
      setCookie('access_token', newAccessToken, { hours: 1 });
      setCookie('refresh_token', newRefreshToken, { days: 14 });
      WebBridge.postMessage({
        type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_TOKEN_REFRESHED,
        payload: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      });
    }
  }
};

export const refreshClientToken = (): Promise<void> => {
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = performRefresh().finally(() => {
    inflightRefresh = null;
  });

  return inflightRefresh;
};
