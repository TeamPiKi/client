import type { WEBBRIDGE_MESSAGE_TYPE } from '../consts/webBridge';

/** 웹 → 앱 인스타그램 스토리 공유 요청 */
export type WebReqShareInstagramStoryMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_SHARE_INSTAGRAM_STORY;
  payload: ShareInstagramStoryPayloadT;
};
export type ShareInstagramStoryPayloadT = {
  requestId: string;
  /** dataURL prefix 없이 base64 본문만 담는다 */
  base64: string;
  mimeType: string;
};

/** 앱 → 웹 인스타그램 스토리 공유 결과 */
export type AppResShareInstagramStoryMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.APP_RES_SHARE_INSTAGRAM_STORY;
  payload: ShareInstagramStoryResultPayloadT;
};

/** success 는 편집 화면 오픈까지만 보장 — 이후 게시/취소는 앱이 알 수 없다 */
export type ShareInstagramStoryStatusT = 'success' | 'notInstalled' | 'error';

export type ShareInstagramStoryResultPayloadT = {
  requestId: string;
  status: ShareInstagramStoryStatusT;
};
