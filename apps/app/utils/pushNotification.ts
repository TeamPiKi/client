import { type DeepLinkPayloadT, WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import {
  AuthorizationStatus,
  getInitialNotification,
  getMessaging,
  getToken,
  hasPermission,
  isDeviceRegisteredForRemoteMessages,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import * as Application from 'expo-application';
import * as Notifications from 'expo-notifications';
import { Linking, PermissionsAndroid, Platform } from 'react-native';

import { WebBridge } from '@/utils/webBridge';

const messaging = getMessaging();

// expo-notifications가 UNUserNotificationCenter delegate를 점유할 때,
// 포그라운드에서 APNs aps.badge 업데이트가 무시되는 것을 방지
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

/** 푸시 알림 권한 체크 */
export const checkPushPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if (Platform.Version < 33) return true;
    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }

  const authStatus = await hasPermission(messaging);

  return (
    authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL
  );
};

/** 푸시 알림 권한 요청 */
export const requestPushPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if (Platform.Version < 33) return true;
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  const authStatus = await requestPermission(messaging);

  return (
    authStatus === AuthorizationStatus.AUTHORIZED || authStatus === AuthorizationStatus.PROVISIONAL
  );
};

/** FCM 토큰 조회 */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const isEnabled = await checkPushPermission();
    if (!isEnabled) return null;

    if (Platform.OS === 'ios' && !isDeviceRegisteredForRemoteMessages(messaging)) {
      await registerDeviceForRemoteMessages(messaging);
    }

    const token = await getToken(messaging);
    if (__DEV__ && token) console.log('[FCM] Token:', token);
    return token;
  } catch (error) {
    console.error('[FCM] 토큰 조회 실패', error);
    return null;
  }
};

/** 앱 → 웹: 푸시 알림 권한 상태 및 FCM 토큰 동기화 */
export const syncPushStatusToWeb = async () => {
  const isEnabled = await checkPushPermission();
  const token = await getFcmToken();
  const deviceId =
    Platform.OS === 'ios' ? await Application.getIosIdForVendorAsync() : Application.getAndroidId();

  if (__DEV__) {
    console.log('[FCM] deviceId:', deviceId);
    console.log('[FCM] token:', token);
  }

  WebBridge.postMessage({
    type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_PUSH_PERMISSION_STATUS,
    payload: { isEnabled, token, deviceId },
  });
};

/** 웹 → 앱: 푸시 알림 권한 요청 */
export const handleRequestPushPermission = async () => {
  const isEnabled = await checkPushPermission();

  /** 이미 권한이 있으면 동기화 후 종료 */
  if (isEnabled) {
    await syncPushStatusToWeb();
    return;
  }

  /** 권한이 없으면 요청 */
  const isGranted = await requestPushPermission();

  /** 요청했는데도 거부당했다면 (과거에 거부한 적이 있어서 팝업이 안 뜬 경우 포함) 설정창 이동 */
  if (!isGranted) await Linking.openSettings();

  await syncPushStatusToWeb();
};

/** OS 레벨 앱 아이콘 뱃지 수 설정 */
export const setAppBadgeCount = async (count: number) => {
  await Notifications.setBadgeCountAsync(count);
};

/** 앱 시작 시 FCM 권한 요청·토큰 로그 및 메시지 리스너 등록 */
export const initializePushNotification = async () => {
  const isEnabled = await checkPushPermission();

  if (!isEnabled) await requestPushPermission();

  await syncPushStatusToWeb();
};

/** 앱 백그라운드/포그라운드 FCM 메시지 수신 처리 */
export const setupMessagingListeners = () => {
  const unsubscribeOnMessage = onMessage(messaging, async remoteMessage => {
    console.log('[FCM] Foreground message:', remoteMessage.messageId);
    const unreadCount = remoteMessage.data?.unreadCount;
    if (unreadCount !== undefined) {
      await setAppBadgeCount(Number(unreadCount));
    }
    // 💡 나중에 Notifee가 들어오면 바로 여기에 Notifee.displayNotification() 코드를 넣으면 됩니다!
  });

  const unsubscribeTokenRefresh = onTokenRefresh(messaging, async token => {
    const deviceId =
      Platform.OS === 'ios'
        ? await Application.getIosIdForVendorAsync()
        : Application.getAndroidId();
    WebBridge.postMessage({
      type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_FCM_TOKEN,
      payload: { token, deviceId },
    });
  });

  const sendDeepLink = (data: Record<string, string> | undefined) => {
    if (!data?.type || !data?.refId) return;
    WebBridge.postMessage({
      type: WEBBRIDGE_MESSAGE_TYPE.APP_REQ_DEEP_LINK,
      payload: { type: data.type, refId: Number(data.refId) } as DeepLinkPayloadT,
    });
  };

  const unsubscribeOpenedApp = onNotificationOpenedApp(messaging, remoteMessage => {
    sendDeepLink(remoteMessage.data as Record<string, string> | undefined);
  });

  void getInitialNotification(messaging).then(remoteMessage => {
    if (remoteMessage) sendDeepLink(remoteMessage.data as Record<string, string> | undefined);
  });

  return () => {
    unsubscribeOnMessage();
    unsubscribeTokenRefresh();
    unsubscribeOpenedApp();
  };
};
