import type { PUSH_NOTIFICATION_TYPE, WEBBRIDGE_MESSAGE_TYPE } from '../consts/webBridge';

/** 웹 → 앱: 현재 알림 권한 상태 조회 */
export type WebReqPushPermissionStatusMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_PUSH_PERMISSION_STATUS;
};

/** 웹 → 앱: 알림 권한 요청 */
export type WebReqPushPermissionMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_PUSH_PERMISSION;
};

/** 웹 → 앱: 앱 알림 설정 화면 열기 */
export type WebReqOpenNotificationSettingsMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_OPEN_NOTIFICATION_SETTINGS;
};

/** 앱 → 웹: 알림 권한 상태 */
export type AppResPushPermissionStatusMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.APP_RES_PUSH_PERMISSION_STATUS;
  payload: PushPermissionStatusPayloadT;
};
export type PushPermissionStatusPayloadT = {
  isEnabled: boolean;
  token: string | null;
  deviceId: string | null;
};

/** 앱 → 웹: FCM 토큰 */
export type AppResFcmTokenMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.APP_RES_FCM_TOKEN;
  payload: FcmTokenPayloadT;
};
export type FcmTokenPayloadT = {
  token: string;
  deviceId: string | null;
};

/** 웹 → 앱: 앱 아이콘 뱃지 수 설정 */
export type WebReqSetBadgeMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_SET_BADGE;
  payload: { count: number };
};

/** 앱 → 웹: 푸시 알림 탭 딥링크 */
export type AppReqDeepLinkMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.APP_REQ_DEEP_LINK;
  payload: DeepLinkPayloadT;
};
export type PushNotificationTypeT = keyof typeof PUSH_NOTIFICATION_TYPE;
export type DeepLinkPayloadT =
  | {
      type: 'TOURNAMENT_JOINED' | 'TOURNAMENT_ITEM_ADDED';
      refId: number;
    }
  | {
      type: 'ITEM_PARSING_COMPLETED' | 'ITEM_PARSING_FAILED';
      refId: number;
      kind: 'WISH' | 'TOURNAMENT';
      tournamentId?: number;
    };
