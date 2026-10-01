import type { HAPTIC_STYLE } from '../consts/haptic';
import type { WEBBRIDGE_MESSAGE_TYPE } from '../consts/webBridge';

export type HapticStyleT = (typeof HAPTIC_STYLE)[keyof typeof HAPTIC_STYLE];

export type HapticPayloadT = {
  style: HapticStyleT;
};

/** 웹 → 앱: 네이티브 햅틱 재생 요청 */
export type WebReqHapticMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_HAPTIC;
  payload: HapticPayloadT;
};
