import type { WebBridgeMessageT } from '../types/webBridge';

type BridgeGateT = {
  /**
   * 동작에 필요한 최소 앱 버전
   * `null`이면 게이트 불필요 or 앱 v1.0.0부터 존재한 기능
   */
  minAppVersion: string | null;
  /**
   * 차단됐을 때 사용자에게 업데이트 안내를 노출할지
   *
   * 사용자가 직접 유발한 동작(피커 열기, 권한 요청 등)에만 true.
   * 애널리틱스·토큰 동기화 같은 백그라운드 동작은 조용히 실패해야 한다.
   */
  notifyOnBlock: boolean;
};

/**
 * 브릿지 메시지별 앱 버전 게이트
 *
 * 웹은 즉시 배포되지만 앱은 스토어 심사·유저 업데이트를 거치므로,
 * 웹이 아직 보급되지 않은 앱 버전의 네이티브 기능을 호출하지 않도록 막는다.
 */
export const BRIDGE_GATE: Record<WebBridgeMessageT['type'], BridgeGateT> = {
  /**
   * 웹 → 앱
   *
   * NOTE: 키는 `WEBBRIDGE_MESSAGE_TYPE`의 키가 아니라 실제 전송되는 값(와이어 포맷)이다.
   * 소셜 로그인처럼 둘이 다른 경우가 있다 (`WEB_REQ_SOCIAL_LOGIN` → `'REQUEST_SOCIAL_LOGIN'`).
   */
  REQUEST_SOCIAL_LOGIN: { minAppVersion: null, notifyOnBlock: true },
  WEB_REQ_LOGOUT: { minAppVersion: null, notifyOnBlock: false },
  WEB_REQ_OPEN_IMAGE_PICKER: { minAppVersion: null, notifyOnBlock: true },
  WEB_REQ_PUSH_PERMISSION: { minAppVersion: null, notifyOnBlock: true },
  WEB_REQ_PUSH_PERMISSION_STATUS: { minAppVersion: null, notifyOnBlock: false },
  WEB_REQ_OPEN_NOTIFICATION_SETTINGS: { minAppVersion: null, notifyOnBlock: true },
  WEB_REQ_READY: { minAppVersion: null, notifyOnBlock: false },
  WEB_REQ_LOG_ANALYTICS_EVENT: { minAppVersion: '1.0.4', notifyOnBlock: false },
  WEB_REQ_TOKEN_REFRESHED: { minAppVersion: '1.0.4', notifyOnBlock: false },
  WEB_REQ_SET_BADGE: { minAppVersion: '1.0.4', notifyOnBlock: false },
  /** TODO: 앱 핸들러 릴리즈 후 `git tag --contains <sha>` 로 실제 태그 확인해 교체 */
  WEB_REQ_SHARE_INSTAGRAM_STORY: { minAppVersion: '1.1.2', notifyOnBlock: true },

  /** 앱 → 웹 — 웹이 보내는 메시지가 아니므로 게이트 대상이 아님 */
  APP_RES_IMAGE_PICKER_SUCCESS: { minAppVersion: null, notifyOnBlock: false },
  APP_RES_IMAGE_PICKER_CANCEL: { minAppVersion: null, notifyOnBlock: false },
  APP_RES_IMAGE_PICKER_ERROR: { minAppVersion: null, notifyOnBlock: false },
  SOCIAL_LOGIN_SUCCESS: { minAppVersion: null, notifyOnBlock: false },
  SOCIAL_LOGIN_ERROR: { minAppVersion: null, notifyOnBlock: false },
  APP_RES_SHARE_INTENT: { minAppVersion: null, notifyOnBlock: false },
  APP_RES_PUSH_PERMISSION_STATUS: { minAppVersion: null, notifyOnBlock: false },
  APP_RES_FCM_TOKEN: { minAppVersion: null, notifyOnBlock: false },
  APP_REQ_DEEP_LINK: { minAppVersion: null, notifyOnBlock: false },
  APP_REQ_NAVIGATE: { minAppVersion: null, notifyOnBlock: false },
  APP_RES_SHARE_INSTAGRAM_STORY: { minAppVersion: null, notifyOnBlock: false },
};
