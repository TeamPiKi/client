import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import 'expo-router/entry';

import { captureError } from '@/utils/captureError';
import { initSentry } from '@/utils/initSentry';
import { setAppBadgeCount } from '@/utils/pushNotification';

/** 앱 화면과 백그라운드 푸시 처리 둘 다 이 파일을 거친다. iOS 공유 확장은 index.share.js 에서 따로 초기화 */
initSentry({
  /** 메인 스레드가 5초 이상 멈추면 스택을 떠서 다음 실행 때 보고 — 부팅 고착 진단용 (iOS) */
  enableAppHangTracking: true,
  appHangTimeoutInterval: 5,
});

/** 백그라운드 FCM 메시지 핸들러 */
setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
  try {
    console.warn('[FCM] Background message:', remoteMessage.messageId ?? 'unknown');
    const unreadCount = remoteMessage.data?.unreadCount;
    if (unreadCount !== undefined) {
      await setAppBadgeCount(Number(unreadCount));
    }
  } catch (error) {
    captureError(error, { tags: { source: 'fcm-background' } });
  }
});
