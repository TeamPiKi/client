import type { SocialLoginSuccessPayloadT, SocialProviderT } from '@piki/core';

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

  const data = await response.json();
  if (!response.ok) {
    /** 5xx 서버 오류만 수집 (4xx는 예상된 흐름이라 제외) */
    if (response.status >= 500) {
      captureError(new Error(`postSocialLogin ${response.status}: ${data.detail ?? 'unknown'}`), {
        tags: { source: 'api', api: 'postSocialLogin', provider },
        extra: { status: response.status },
      });
    }
    throw new Error(data.detail ?? '로그인에 실패했습니다.');
  }

  return data.data;
};
