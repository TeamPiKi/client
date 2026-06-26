import type { WEBBRIDGE_MESSAGE_TYPE, WEB_REQ_READY_PAYLOAD_TYPE } from '../consts/webBridge';
import type { WebReqLogAnalyticsEventMessageT } from './analytics';
import type {
  AppResImagePickerCancelMessageT,
  AppResImagePickerErrorMessageT,
  AppResImagePickerSuccessMessageT,
  WebReqOpenImagePickerMessageT,
} from './image';
import type {
  RequestSocialLoginMessageT,
  SocialLoginErrorMessageT,
  SocialLoginSuccessMessageT,
  WebReqLogoutMessageT,
  WebReqTokenRefreshedMessageT,
} from './login';
import type {
  AppReqDeepLinkMessageT,
  AppResFcmTokenMessageT,
  AppResPushPermissionStatusMessageT,
  WebReqOpenNotificationSettingsMessageT,
  WebReqPushPermissionMessageT,
  WebReqPushPermissionStatusMessageT,
  WebReqSetBadgeMessageT,
} from './pushNotification';
import type { AppResShareIntentMessageT } from './shareIntent';

export type WebBridgeMessageT =
  | WebReqOpenImagePickerMessageT
  | AppResImagePickerSuccessMessageT
  | AppResImagePickerCancelMessageT
  | AppResImagePickerErrorMessageT
  | RequestSocialLoginMessageT
  | SocialLoginSuccessMessageT
  | SocialLoginErrorMessageT
  | AppResShareIntentMessageT
  | WebReqReadyMessageT
  | WebReqPushPermissionStatusMessageT
  | WebReqPushPermissionMessageT
  | WebReqOpenNotificationSettingsMessageT
  | AppResPushPermissionStatusMessageT
  | AppResFcmTokenMessageT
  | AppReqDeepLinkMessageT
  | WebReqLogoutMessageT
  | WebReqLogAnalyticsEventMessageT
  | WebReqTokenRefreshedMessageT
  | WebReqSetBadgeMessageT;

/** 웹이 페이지 hydrate 완료 후 RN에게 메시지 수신 준비됨을 알리는 메시지 */
export type WebReqReadyMessageT = {
  type: typeof WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_READY;
  payload: {
    type: typeof WEB_REQ_READY_PAYLOAD_TYPE.SHARE_INTENT;
  };
};
