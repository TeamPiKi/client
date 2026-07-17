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
import type {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from 'react-native-webview/lib/WebViewTypes';

import { USER_AGENT } from '@/constants/userAgent';
import { useShareIntent } from '@/hooks/useShareIntent';
import { useSocialLogin } from '@/hooks/useSocialLogin';
import { useSplashScreenController } from '@/hooks/useSplashScreenController';
import { useWebBridgeMessage } from '@/hooks/useWebBridgeMessage';
import { useWebDeepLink } from '@/hooks/useWebDeepLink';
import { useWebviewCookieSync } from '@/hooks/useWebviewCookieSync';
import { logAnalyticsEvent, logAppOpenEvent } from '@/utils/analytics';
import { captureError } from '@/utils/captureError';
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
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);
  const [pendingWarmStartPath, setPendingWarmStartPath] = useState<string | null>(null);

  const { handleLogin } = useSocialLogin();
  const { isSynced } = useWebviewCookieSync();

  const handleWebviewUriChange = useCallback((uri: string) => setWebviewUri(uri), []);

  /** warm start 딥링크 — 이미 로드된 웹뷰에 경로만 전달해 SPA 전환 (문서 리로드 방지) */
  const handleWarmStartNavigate = useCallback(
    (path: string) => {
      if (!isSynced || !isWebViewLoaded || !webviewRef.current)
        return setPendingWarmStartPath(path);

      WebBridge.postMessage({
        type: WEBBRIDGE_MESSAGE_TYPE.APP_REQ_NAVIGATE,
        payload: { path },
      });
    },
    [isSynced, isWebViewLoaded]
  );

  useWebDeepLink({ onColdStart: handleWebviewUriChange, onWarmStart: handleWarmStartNavigate });

  useEffect(() => {
    WebBridge.setRef(webviewRef);
    return () => WebBridge.clearRef(webviewRef);
  }, []);

  useEffect(() => {
    if (!isSynced || !isWebViewLoaded || pendingWarmStartPath === null || !webviewRef.current)
      return;

    WebBridge.postMessage({
      type: WEBBRIDGE_MESSAGE_TYPE.APP_REQ_NAVIGATE,
      payload: { path: pendingWarmStartPath },
    });
    setPendingWarmStartPath(null);
  }, [isSynced, isWebViewLoaded, pendingWarmStartPath]);

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

  const handleWebViewLoadEnd = useCallback(() => {
    onWebViewLoadEnd();
    setIsWebViewLoaded(true);
  }, [onWebViewLoadEnd]);

  /** WebView 로드 실패(네이티브 측) 수집 + 기존 스플래시 처리 유지 */
  const handleWebViewError = useCallback(
    (event: WebViewErrorEvent) => {
      const { nativeEvent } = event;
      captureError(new Error(`WebView load error: ${nativeEvent.description}`), {
        tags: { source: 'webview' },
        extra: { url: nativeEvent.url, code: nativeEvent.code },
      });
      onWebViewLoadError();
    },
    [onWebViewLoadError]
  );

  /** WebView HTTP 5xx 응답만 수집 */
  const handleWebViewHttpError = useCallback((event: WebViewHttpErrorEvent) => {
    const { nativeEvent } = event;
    if (nativeEvent.statusCode >= 500) {
      captureError(new Error(`WebView HTTP ${nativeEvent.statusCode}: ${nativeEvent.url}`), {
        tags: { source: 'webview' },
        extra: { url: nativeEvent.url, statusCode: nativeEvent.statusCode },
      });
    }
  }, []);

  return (
    <>
      {isSynced && (
        <Webview
          ref={webviewRef}
          style={{ flex: 1 }}
          applicationNameForUserAgent={USER_AGENT}
          source={{ uri: webviewUri }}
          onMessage={onMessage}
          onLoadEnd={handleWebViewLoadEnd}
          onError={handleWebViewError}
          onHttpError={handleWebViewHttpError}
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
