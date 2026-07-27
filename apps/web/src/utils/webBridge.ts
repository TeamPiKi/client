import { BRIDGE_GATE, WEBVIEW_UA_TOKEN, type WebBridgeMessageT } from '@piki/core';
import { toast } from 'sonner';

import { getAppVersion, isAppVersionSupported } from '@/utils/appVersion';

type RNWebViewWindowT = {
  ReactNativeWebView: {
    postMessage: (message: string) => void;
  };
};

/** RN WebView window인지 타입 가드 */
const isRNWebViewWindow = (window: unknown): window is RNWebViewWindowT => {
  if (typeof window !== 'object' || window === null) return false;
  if (!('ReactNativeWebView' in window)) return false;

  const rnWebview = window['ReactNativeWebView'];
  if (typeof rnWebview !== 'object' || rnWebview === null) return false;
  if (!('postMessage' in rnWebview)) return false;
  return typeof rnWebview['postMessage'] === 'function';
};

/**
 * @param userAgentFromServer 서버 환경일 때 전달받은 user-agent
 * @returns 현재 환경이 RN WebView(앱)인 경우 true, 그 외 경우 false
 *
 * @example 클라이언트 환경일 때
 * isWebview()
 *
 * @example 서버 환경일 때
 * const headerStore = await headers();
 * const userAgent = headerStore.get('user-agent');
 * isWebview(userAgent)
 */
export const isWebview = (userAgentFromServer: string | null = null) => {
  /** 클라이언트 환경일 떄 */
  if (typeof window !== 'undefined') {
    const isAppByUA = navigator.userAgent.includes(WEBVIEW_UA_TOKEN);
    const isAppByWindow = isRNWebViewWindow(window);

    return isAppByUA || isAppByWindow;
  }

  /** 서버 환경일 때 */
  if (userAgentFromServer) return userAgentFromServer.includes(WEBVIEW_UA_TOKEN);
  return false;
};

/**
 * Webview 메시지 송신 핸들러
 *
 * - 앱 버전이 해당 기능을 지원하지 않으면 메시지를 전송하지 않음
 *
 * @returns 메시지를 실제로 전송했으면 true
 * @note 앱 응답을 기다리는 호출부는 이 값으로 대기 상태를 정리해야 함
 *
 * @example
 * WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_PUSH_PERMISSION, payload: ... })
 */
export const WebBridge = {
  postMessage(message: WebBridgeMessageT) {
    if (typeof window === 'undefined') return false;
    if (!isRNWebViewWindow(window)) return false;

    const { minAppVersion, notifyOnBlock } = BRIDGE_GATE[message.type];
    if (minAppVersion && !isAppVersionSupported(getAppVersion(), minAppVersion)) {
      /** 백그라운드 동작은 사용자가 유발한 게 아니므로 조용히 실패시킨다 */
      if (notifyOnBlock) toast.info('앱을 업데이트하면 사용할 수 있어요.');
      return false;
    }

    window.ReactNativeWebView.postMessage(JSON.stringify(message));
    return true;
  },
};
