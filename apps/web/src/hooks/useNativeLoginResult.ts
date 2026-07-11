import { WEBBRIDGE_MESSAGE_TYPE, isWebBridgeMessageT } from '@piki/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

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

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data);
        if (!isWebBridgeMessageT(parsed)) return;

        if (parsed.type === WEBBRIDGE_MESSAGE_TYPE.SOCIAL_LOGIN_SUCCESS) {
          const { accessToken, refreshToken } = parsed.payload;
          setCookie('access_token', accessToken, { minutes: 15 });
          setCookie('refresh_token', refreshToken, { days: 14 });
          onSettled?.();
          /** 쿠키 세팅 후 FCM 토큰 재등록 — 로그인 전 첫 시도는 인증 없어서 실패하기 때문 */
          WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_PUSH_PERMISSION_STATUS });
          router.replace(getLoginRedirectPath(redirect));
        } else if (parsed.type === WEBBRIDGE_MESSAGE_TYPE.SOCIAL_LOGIN_ERROR) {
          onSettled?.();
          toast.error('요청을 처리하지 못했어요. 다시 시도해 주세요.');
          router.replace(getLoginPath(redirect));
        }
      } catch {
        /** JSON.parse 실패 등 유효하지 않은 메시지는 무시 */
      }
    };

    /** RN → 웹 메시지는 iOS 에선 window, Android 에선 document 에 dispatch 된다 (react-native-webview 동작) */
    window.addEventListener('message', handler);
    document.addEventListener('message', handler as EventListener);
    return () => {
      window.removeEventListener('message', handler);
      document.removeEventListener('message', handler as EventListener);
    };
  }, [onSettled, redirect, router]);
};
