import {
  WEBBRIDGE_MESSAGE_TYPE,
  WEB_REQ_READY_PAYLOAD_TYPE,
  type WebBridgeMessageT,
} from '@piki/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Platform, View } from 'react-native';
import type { WebView } from 'react-native-webview';
import Webview from 'react-native-webview';
import type {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
  WebViewOpenWindowEvent,
  WebViewRenderProcessGoneEvent,
  WebViewTerminatedEvent,
} from 'react-native-webview/lib/WebViewTypes';

import SplashOverlay from '@/components/SplashOverlay';
import { USER_AGENT } from '@/constants/userAgent';
import { useShareIntent } from '@/hooks/useShareIntent';
import { useSocialLogin } from '@/hooks/useSocialLogin';
import { useSplashScreenController } from '@/hooks/useSplashScreenController';
import { useWebBridgeMessage } from '@/hooks/useWebBridgeMessage';
import { useWebDeepLink } from '@/hooks/useWebDeepLink';
import { useWebviewCookieSync } from '@/hooks/useWebviewCookieSync';
import { logAnalyticsEvent, logAppOpenEvent } from '@/utils/analytics';
import { captureError } from '@/utils/captureError';
import { handleHaptic } from '@/utils/handleHaptic';
import { handleOpenImagePicker } from '@/utils/handleImage';
import { handleShareInstagramStory } from '@/utils/handleInstagramStory';
import { handleOpenExternalUrl } from '@/utils/handleOpenExternalUrl';
import { handleOpenStore } from '@/utils/handleOpenStore';
import {
  handleRequestPushPermission,
  setAppBadgeCount,
  syncPushStatusToWeb,
} from '@/utils/pushNotification';
import { TokenStorage } from '@/utils/tokenStorage';
import { WebBridge } from '@/utils/webBridge';

const HOME_URI = process.env.EXPO_PUBLIC_WEB_URL;

function Page() {
  const webviewRef = useRef<WebView | null>(null);
  const [webviewUri, setWebviewUri] = useState(HOME_URI);
  /** WebView 재생성용 key */
  const [webviewKey, setWebviewKey] = useState(0);
  const lastUrlRef = useRef<string | null>(null);
  /** 워밍업 페이지 로드 완료 여부 */
  const [isWarmupLoaded, setIsWarmupLoaded] = useState(false);
  /** 실제 페이지 로드 완료 여부 */
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);
  /** 이동 대기 중인 딥링크 경로 */
  const [pendingWarmStartPath, setPendingWarmStartPath] = useState<string | null>(null);

  const { handleLogin } = useSocialLogin();
  const { isSynced } = useWebviewCookieSync(isWarmupLoaded);

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
    if (!isSynced || !isWebViewLoaded || !webviewRef.current || pendingWarmStartPath === null)
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

  const { sendShareIntent, getRecoveryUri } = useShareIntent({
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
        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_SOCIAL_LOGIN:
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

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_SHARE_INSTAGRAM_STORY:
          await handleShareInstagramStory(message.payload);
          return;

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_OPEN_STORE:
          await handleOpenStore();
          return;

        case WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_HAPTIC:
          await handleHaptic(message.payload);
          return;

        default:
          return;
      }
    },
    [sendShareIntent, handleLogin]
  );

  const { onMessage } = useWebBridgeMessage(handleWebMessage);
  const { isSplashOverlayVisible, onWebViewLoadEnd, onWebViewLoadError } =
    useSplashScreenController();

  const handleWebViewLoadEnd = useCallback(
    (event: WebViewNavigationEvent | WebViewErrorEvent) => {
      if (event.nativeEvent.url === 'about:blank') {
        setIsWarmupLoaded(true);
        return;
      }

      onWebViewLoadEnd();
      setIsWebViewLoaded(true);
    },
    [onWebViewLoadEnd]
  );

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

  /** 새 창 링크는 WebView 안에서 열지 않음 — iOS 는 핸들러가 없으면 같은 WebView 로 이동해 버림 */
  const handleOpenWindow = useCallback((event: WebViewOpenWindowEvent) => {
    handleOpenExternalUrl(event.nativeEvent.targetUrl);
  }, []);

  const handleNavigationStateChange = useCallback((navigation: WebViewNavigation) => {
    lastUrlRef.current = navigation.url.split('?')[0] ?? null;
  }, []);

  const recoverWebViewProcess = useCallback(
    (extra: Record<string, unknown>) => {
      const error = new Error('WebView process terminated');
      error.name = 'WebViewProcessTerminated';
      captureError(error, {
        tags: { source: 'webview', platform: Platform.OS },
        extra: { url: lastUrlRef.current, ...extra },
      });

      setIsWebViewLoaded(false);
      setWebviewUri(getRecoveryUri(HOME_URI));
      setWebviewKey(key => key + 1);
    },
    [getRecoveryUri]
  );

  const handleContentProcessDidTerminate = useCallback(
    (_event: WebViewTerminatedEvent) => recoverWebViewProcess({}),
    [recoverWebViewProcess]
  );

  const handleRenderProcessGone = useCallback(
    (event: WebViewRenderProcessGoneEvent) =>
      recoverWebViewProcess({ didCrash: event.nativeEvent.didCrash }),
    [recoverWebViewProcess]
  );

  return (
    <View style={{ flex: 1 }}>
      <Webview
        key={webviewKey}
        ref={webviewRef}
        style={{ flex: 1 }}
        applicationNameForUserAgent={USER_AGENT}
        source={isSynced ? { uri: webviewUri } : { html: '' }}
        onMessage={onMessage}
        onLoadEnd={handleWebViewLoadEnd}
        onError={handleWebViewError}
        onHttpError={handleWebViewHttpError}
        onNavigationStateChange={handleNavigationStateChange}
        onOpenWindow={handleOpenWindow}
        onContentProcessDidTerminate={handleContentProcessDidTerminate}
        onRenderProcessGone={handleRenderProcessGone}
        allowsBackForwardNavigationGestures
        setBuiltInZoomControls={false}
        cacheEnabled
        domStorageEnabled // NOTE: true로 설정해야 안드로이드 localStorage 작동 가능
        sharedCookiesEnabled
        webviewDebuggingEnabled={__DEV__}
        startInLoadingState
      />
      {isSplashOverlayVisible && <SplashOverlay />}
    </View>
  );
}

export default Page;
