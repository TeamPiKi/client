import { APP_STORE_URL } from '@piki/core';
import { Linking, Platform } from 'react-native';

import { captureError } from '@/utils/captureError';

/** WEB_REQ_OPEN_STORE 수신 시 플랫폼에 맞는 스토어 상세 페이지로 이동 */
export const handleOpenStore = async () => {
  const url = Platform.OS === 'ios' ? APP_STORE_URL.IOS : APP_STORE_URL.ANDROID;

  try {
    await Linking.openURL(url);
  } catch (error) {
    captureError(error, { tags: { source: 'webBridge' }, extra: { url } });
  }
};
