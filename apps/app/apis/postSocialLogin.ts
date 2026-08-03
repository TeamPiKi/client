import type { ApiErrorCodeT, SocialLoginSuccessPayloadT, SocialProviderT } from '@piki/core';
import { DEFAULT_ERROR_MESSAGE, SERVER_ERROR_MESSAGE, getErrorMessageByCode } from '@piki/core';

import { captureError } from '@/utils/captureError';

type PostSocialLoginRequestT = {
  accessToken: string;
};

export const postSocialLogin = async (
  provider: SocialProviderT,
  body: PostSocialLoginRequestT
): Promise<SocialLoginSuccessPayloadT> => {
  let response: Response;
  try {
    response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/login/${provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'app',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    /** 네트워크 오류 */
    captureError(error, { tags: { source: 'api', api: 'postSocialLogin', provider } });
    throw error;
  }

  let data: { data: SocialLoginSuccessPayloadT; code: ApiErrorCodeT | null } | null = null;
  try {
    data = await response.json();
  } catch {
    /** 바디가 JSON이 아님 (프록시 HTML 에러 페이지·빈 바디 등) — data는 null 유지 */
  }

  if (!response.ok) {
    /** 5xx 서버 오류만 수집 (4xx는 예상된 흐름이라 제외) */
    if (response.status >= 500) {
      captureError(new Error(`postSocialLogin ${response.status}: ${data?.code ?? 'unknown'}`), {
        tags: { source: 'api', api: 'postSocialLogin', provider },
        extra: { status: response.status },
      });
    }
    const fallback = response.status >= 500 ? SERVER_ERROR_MESSAGE : DEFAULT_ERROR_MESSAGE;
    throw new Error(getErrorMessageByCode(data?.code) ?? fallback);
  }

  if (!data) {
    /** 2xx인데 본문이 비었거나 깨짐 — 예상 못 한 이상 응답이라 수집 */
    captureError(new Error(`postSocialLogin ${response.status}: empty/invalid body`), {
      tags: { source: 'api', api: 'postSocialLogin', provider },
      extra: { status: response.status },
    });
    throw new Error('서버 응답을 해석할 수 없습니다.');
  }

  return data.data;
};
