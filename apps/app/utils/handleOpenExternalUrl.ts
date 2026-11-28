import { Linking } from 'react-native';

import { captureError } from '@/utils/captureError';

const EXTERNAL_URL_PROTOCOLS = ['http:', 'https:'];

const isExternalUrl = (url: string) => {
  try {
    return EXTERNAL_URL_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return false;
  }
};

/** 웹의 새 창 링크(target="_blank")를 앱 밖 기기 기본 브라우저로 염 */
export const handleOpenExternalUrl = async (url: string) => {
  if (!isExternalUrl(url)) return;

  try {
    await Linking.openURL(url);
  } catch (error) {
    captureError(error, { tags: { source: 'webview' }, extra: { url } });
  }
};
