import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';

import { clearAuthCookies } from '@/actions/clearAuthCookies';
import { deleteCookie } from '@/utils/cookie';
import { WebBridge, isWebview } from '@/utils/webBridge';

/**
 * 클라이언트에서 인증 세션을 폐기하는 단일 진입점.
 *
 * - 웹뷰: 쿠키가 JS 로 심어져 있어 바로 지우고, 앱 재시작 시 재주입되지 않도록 네이티브 저장소까지 비운다
 * - 웹: httpOnly 라 JS 로 지울 수 없어 서버 액션으로 폐기한다
 */
export const clearAuthSession = async () => {
  if (isWebview()) {
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_LOGOUT });

    return;
  }

  await clearAuthCookies();
};
