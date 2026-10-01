import { type HapticStyleT, WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';

import { WebBridge } from '@/utils/webBridge';

/** NOTE: 웹뷰 밖에선 postMessage 가 false 를 돌려줄 뿐 아무 일도 없음 */
export const triggerHaptic = (style: HapticStyleT) =>
  WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_HAPTIC, payload: { style } });
