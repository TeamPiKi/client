import { DEFAULT_ERROR_MESSAGE, WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useWebBridgeMessage } from '@/hooks/useWebBridgeMessage';
import { setCookie } from '@/utils/cookie';
import { getLoginPath, getLoginRedirectPath } from '@/utils/loginRedirect';
import { WebBridge } from '@/utils/webBridge';

type UseNativeLoginResultOptionsT = {
  redirect?: string | null;
  onSettled?: () => void;
};

export const useNativeLoginResult = ({
  redirect = null,
  onSettled,
}: UseNativeLoginResultOptionsT = {}) => {
  const router = useRouter();

  useWebBridgeMessage(
    useCallback(
      message => {
        if (message.type === WEBBRIDGE_MESSAGE_TYPE.APP_RES_SOCIAL_LOGIN_SUCCESS) {
          const { accessToken, refreshToken } = message.payload;
          setCookie('access_token', accessToken, { minutes: 15 });
          setCookie('refresh_token', refreshToken, { days: 14 });
          onSettled?.();
          /** 쿠키 세팅 후 FCM 토큰 재등록 — 로그인 전 첫 시도는 인증 없어서 실패하기 때문 */
          WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_PUSH_PERMISSION_STATUS });
          router.replace(getLoginRedirectPath(redirect));
        } else if (message.type === WEBBRIDGE_MESSAGE_TYPE.APP_RES_SOCIAL_LOGIN_ERROR) {
          onSettled?.();
          toast.error(DEFAULT_ERROR_MESSAGE);
          router.replace(getLoginPath(redirect));
        }
      },
      [onSettled, redirect, router]
    )
  );
};
