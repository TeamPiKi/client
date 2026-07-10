import type { WEBBRIDGE_MESSAGE_TYPE } from '../consts/webBridge';

/** 앱 → 웹: 이미 로드된 웹뷰에서 경로 이동 (warm start 딥링크 SPA 전환용) */
export type AppReqNavigateMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.APP_REQ_NAVIGATE;
  payload: NavigatePayloadT;
};

export type NavigatePayloadT = {
  /** 동일 오리진 경로 (pathname + search), 예: /tournament/join/123?code=abc */
  path: string;
};
