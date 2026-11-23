import { type ShareIntentPayloadT, WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { useShareIntentContext } from 'expo-share-intent';
import { useCallback, useEffect, useRef } from 'react';

import { toShareIntentPayload } from '@/utils/serializeShareIntent';
import { WebBridge } from '@/utils/webBridge';

const WISHLIST_PATH = '/wish';

const isWishlistPath = (uri: URL) => uri.pathname === WISHLIST_PATH;

const toWishlistUri = (uri: string) => {
  const nextUri = new URL(uri);
  nextUri.pathname = WISHLIST_PATH;
  nextUri.search = '';
  nextUri.hash = '';
  return nextUri.toString();
};

type Props = {
  onChangeWebviewUri: (uri: string) => void;
  webviewUri: string;
};

/** 다른 앱에서의 share intent 수신과 웹으로의 전달 흐름을 관리 */
export const useShareIntent = ({ onChangeWebviewUri, webviewUri }: Props) => {
  const pendingShareIntentsRef = useRef<ShareIntentPayloadT[]>([]);

  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();

  /** pending payload를 웹으로 전송하고 ref/native intent 정리 */
  const sendShareIntent = useCallback(() => {
    const pendings = pendingShareIntentsRef.current;
    if (pendings.length === 0) return;

    pendings.forEach(payload =>
      WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.APP_RES_SHARE_INTENT, payload })
    );
    resetShareIntent();
    pendingShareIntentsRef.current = [];
  }, [resetShareIntent]);

  /** WebView 재생성 시 열 주소. 전달 전 공유가 있으면 위시 목록 */
  const getRecoveryUri = useCallback(
    (homeUri: string) =>
      pendingShareIntentsRef.current.length > 0 ? toWishlistUri(homeUri) : homeUri,
    []
  );

  /** 다른 앱에서 ShareIntent 수신 후 웹으로 전송 */
  useEffect(() => {
    if (!hasShareIntent) return;

    const payload = toShareIntentPayload(shareIntent);
    const serialized = JSON.stringify(payload);
    const isQueued = pendingShareIntentsRef.current.some(
      pending => JSON.stringify(pending) === serialized
    );
    if (isQueued) return;

    pendingShareIntentsRef.current.push(payload);

    try {
      /** 이미 위시 목록: 즉시 전송 */
      if (isWishlistPath(new URL(webviewUri))) {
        sendShareIntent();
        return;
      }

      /** 다른 페이지: payload 보관 후 위시 목록으로 이동 → WEB_REQ_READY 수신 시 전송 */
      onChangeWebviewUri(toWishlistUri(webviewUri));
    } catch {
      return;
    }
  }, [hasShareIntent, onChangeWebviewUri, shareIntent, webviewUri, sendShareIntent]);

  return { sendShareIntent, getRecoveryUri };
};
