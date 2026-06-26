import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import 'expo-router/entry';

import { setAppBadgeCount } from '@/utils/pushNotification';

/** 백그라운드 FCM 메시지 핸들러 */
setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
  console.warn('[FCM] Background message:', remoteMessage.messageId ?? 'unknown');
  const unreadCount = remoteMessage.data?.unreadCount;
  if (unreadCount !== undefined) {
    await setAppBadgeCount(Number(unreadCount));
  }
});
