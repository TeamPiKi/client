import { Platform } from 'react-native';

/**
 * 공유 바텀시트의 close / openHostApp 플랫폼 분기 어댑터
 * - iOS: expo-share-extension (별도 익스텐션 타겟의 네이티브 모듈)
 * - Android: 로컬 piki-share 모듈 (투명 테마 ShareActivity)
 *
 * 두 네이티브 모듈 모두 반대 플랫폼에는 존재하지 않아 import 시점에 throw 하므로 lazy require 한다.
 */

const APP_SCHEME_BASE_URL = 'piki://app';

const getIosModule = () => require('expo-share-extension') as typeof import('expo-share-extension');

const getAndroidModule = () =>
  (require('@/modules/piki-share') as typeof import('@/modules/piki-share')).default;

export const close = () => {
  if (Platform.OS === 'ios') {
    getIosModule().close();
    return;
  }

  getAndroidModule().close();
};

/** path 규칙은 iOS openHostApp 과 동일: `/{path}?{query}` */
export const openHostApp = (path: string) => {
  if (Platform.OS === 'ios') {
    getIosModule().openHostApp(path);
    return;
  }

  getAndroidModule().openHostApp(`${APP_SCHEME_BASE_URL}${path}`);
};
