import {
  WEBBRIDGE_MESSAGE_TYPE,
  WEB_REQ_READY_PAYLOAD_TYPE,
  type WebBridgeMessageT,
} from '@piki/core';
import CookieManager from '@react-native-cookies/cookies';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import type { WebView } from 'react-native-webview';
import Webview from 'react-native-webview';

import { USER_AGENT } from '@/constants/userAgent';
import { useShareIntent } from '@/hooks/useShareIntent';
import { useSocialLogin } from '@/hooks/useSocialLogin';
import { useSplashScreenController } from '@/hooks/useSplashScreenController';
import { useWebBridgeMessage } from '@/hooks/useWebBridgeMessage';
import { useWebDeepLink } from '@/hooks/useWebDeepLink';
import { useWebviewCookieSync } from '@/hooks/useWebviewCookieSync';
import { logAnalyticsEvent, logAppOpenEvent } from '@/utils/analytics';
import { handleOpenImagePicker } from '@/utils/handleImage';
import {
  handleRequestPushPermission,
  setAppBadgeCount,
  syncPushStatusToWeb,
} from '@/utils/pushNotification';
import { TokenStorage } from '@/utils/tokenStorage';
import { WebBridge } from '@/utils/webBridge';

function Page() {
  const webviewRef = useRef<WebView | null>(null);
  const [webviewUri, setWebviewUri] = useState(process.env.EXPO_PUBLIC_WEB_URL);

  const { handleLogin } = useSocialLogin();
  const { isSynced } = useWebviewCookieSync();

  const handleWebviewUriChange = useCallback((uri: string) => setWebviewUri(uri), []);

  useWebDeepLink(handleWebviewUriChange);

  useEffect(() => {
    WebBridge.setRef(webviewRef);
    return () => WebBridge.clearRef(webviewRef);
  }, []);

  // 앱 진입 시 GA4(Firebase Analytics) 세션 시작.
  useEffect(() => {
    void logAppOpenEvent();
  }, []);

  // 포그라운드 복귀 시 WKHTTPCookieStore → SecureStore 동기화
  // proxy.ts(서버)에서 토큰 갱신 시 WebBridge 호출 불가 → AppState로 커버
  useEffect(() => {
    const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? 'http://localhost:3000';

    const syncCookies = async () => {
      const cookies = await CookieManager.get(WEB_URL, Platform.OS === 'ios');
      const accessToken = cookies['access_token']?.value;
      const refreshToken = cookies['refresh_token']?.value;
      if (accessToken && refreshToken) {
        await TokenStorage.setTokens(accessToken, refreshToken);
      }
    };

    syncCookies();

    const subscription = AppState.addEventListener('change', async nextState => {
      if (nextState !== 'active') return;
      syncCookies();
    });

    return () => subscription.remove();
  }, []);

  const { sendShareIntent } = useShareIntent({
    onChangeWebviewUri: handleWebviewUriChange,
    webviewUri,
  });

  const handleWebMessage = useCallback(
    async (message: WebBridgeMessageT) => {
      switch (message.type) {
        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_READY: {
          const { type } = message.payload;
          if (type === WEB_REQ_READY_PAYLOAD_TYPE.SHARE_INTENT) sendShareIntent();
          return;
        }

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_OPEN_IMAGE_PICKER:
          await handleOpenImagePicker(message.payload);
          return;
        case WEBBRIDGE_MESSAGE_TYPE.REQUEST_SOCIAL_LOGIN:
          await handleLogin(message.payload.provider);
          return;

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_PUSH_PERMISSION_STATUS:
          await syncPushStatusToWeb();
          return;

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_PUSH_PERMISSION:
          await handleRequestPushPermission();
          return;

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_OPEN_NOTIFICATION_SETTINGS:
          await Linking.openSettings();
          return;

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_LOGOUT:
          await TokenStorage.clearTokens();
          return;

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_TOKEN_REFRESHED:
          await TokenStorage.setTokens(message.payload.accessToken, message.payload.refreshToken);
          return;

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_LOG_ANALYTICS_EVENT:
          await logAnalyticsEvent(message.payload.name, message.payload.params);
          return;

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_SET_BADGE:
          await setAppBadgeCount(message.payload.count);
          return;

        default:
          return;
      }
    },
    [sendShareIntent, handleLogin]
  );

  const { onMessage } = useWebBridgeMessage(handleWebMessage);
  const { onWebViewLoadEnd, onWebViewLoadError } = useSplashScreenController();

  return (
    <>
      {isSynced && (
        <Webview
          ref={webviewRef}
          style={{ flex: 1 }}
          applicationNameForUserAgent={USER_AGENT}
          source={{ uri: webviewUri }}
          onMessage={onMessage}
          onLoadEnd={onWebViewLoadEnd}
          onError={onWebViewLoadError}
          allowsBackForwardNavigationGestures
          cacheEnabled
          webviewDebuggingEnabled={__DEV__}
          startInLoadingState
        />
      )}
    </>
  );
}

export default Page;
