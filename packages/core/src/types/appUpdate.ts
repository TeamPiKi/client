import type { WEBBRIDGE_MESSAGE_TYPE } from '../consts/webBridge';

/** 웹 → 앱: 플랫폼에 맞는 스토어(App Store / Play Store) 상세 페이지 열기 요청 */
export type WebReqOpenStoreMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_OPEN_STORE;
};
