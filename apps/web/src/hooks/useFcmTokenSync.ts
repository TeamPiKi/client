'use client';

import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { useCallback, useEffect } from 'react';

import { postFcmToken } from '@/apis/postFcmToken';
import { useWebBridgeMessage } from '@/hooks/useWebBridgeMessage';
import { isTokenValid } from '@/utils/auth';
import { captureError } from '@/utils/captureError';
import { getCookie } from '@/utils/cookie';
import { WebBridge, isWebview as isWebviewFn } from '@/utils/webBridge';

/** 앱 진입 시 FCM 토큰을 서버에 등록 */
export const useFcmTokenSync = () => {
  const isWebview = isWebviewFn();
  const accessToken = getCookie('access_token');
  const canSyncFcm = !!accessToken && isTokenValid(accessToken);

  useWebBridgeMessage(
    useCallback(message => {
      const token = getCookie('access_token');
      if (!token || !isTokenValid(token)) return;

      if (
        message.type === WEBBRIDGE_MESSAGE_TYPE.APP_RES_PUSH_PERMISSION_STATUS &&
        message.payload.token
      ) {
        postFcmToken(message.payload.token, message.payload.deviceId).catch(error =>
          captureError(error, { tags: { source: 'fcm-token-sync' } })
        );
      }

      if (message.type === WEBBRIDGE_MESSAGE_TYPE.APP_RES_FCM_TOKEN) {
        postFcmToken(message.payload.token, message.payload.deviceId).catch(error =>
          captureError(error, { tags: { source: 'fcm-token-sync' } })
        );
      }
    }, [])
  );

  useEffect(() => {
    if (!isWebview || !canSyncFcm) return;

    WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_PUSH_PERMISSION_STATUS });
  }, [isWebview, canSyncFcm]);
};
