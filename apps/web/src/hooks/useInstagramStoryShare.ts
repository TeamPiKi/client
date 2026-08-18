'use client';

import { type ShareInstagramStoryStatusT, WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useWebBridgeMessage } from '@/hooks/useWebBridgeMessage';
import { blobToBase64 } from '@/utils/handleImage';
import { WebBridge } from '@/utils/webBridge';

/** 앱이 응답하지 않을 때 버튼이 영구히 잠기지 않도록 두는 상한 */
const RESPONSE_TIMEOUT_MS = 15_000;

/** `blocked` 는 앱 버전 게이트에 막혀 전송조차 안 된 경우 */
/** 'blocked' 앱 버전 게이트에 막힘 · 'busy' 이미 공유 진행 중 */
export type InstagramStoryShareResultT = ShareInstagramStoryStatusT | 'blocked' | 'busy';

type PendingRequestT = {
  resolve: (status: ShareInstagramStoryStatusT) => void;
  timeoutId: number;
};

/**
 * 영수증 이미지를 인스타그램 스토리로 공유하는 훅 (앱 전용)
 *
 * 이미지를 base64 로 앱에 넘기고 결과만 받는다. shareToStory 는 throw 하지 않는다.
 */
export const useInstagramStoryShare = () => {
  const pendingRequestsRef = useRef<Map<string, PendingRequestT>>(new Map());
  const [isSharing, setIsSharing] = useState(false);
  const isSharingRef = useRef(false);

  const settleRequest = useCallback((requestId: string, status: ShareInstagramStoryStatusT) => {
    const pending = pendingRequestsRef.current.get(requestId);
    if (!pending) return;

    window.clearTimeout(pending.timeoutId);
    pendingRequestsRef.current.delete(requestId);
    pending.resolve(status);
  }, []);

  /** 앱 → 웹 스토리 공유 결과 수신 */
  useWebBridgeMessage(message => {
    if (message.type !== WEBBRIDGE_MESSAGE_TYPE.APP_RES_SHARE_INSTAGRAM_STORY) return;

    /** 구버전 앱이 다른 형태를 보낼 수 있어 payload 를 방어적으로 읽는다 */
    const payload = message.payload;
    if (!payload || typeof payload.requestId !== 'string') return;

    const status: ShareInstagramStoryStatusT =
      payload.status === 'success' || payload.status === 'notInstalled' ? payload.status : 'error';

    settleRequest(payload.requestId, status);
  });

  /** 언마운트 시 대기 중인 요청 정리 — 타이머가 남아 setState 하는 것도 막는다 */
  useEffect(
    () => () => {
      pendingRequestsRef.current.forEach(pending => {
        window.clearTimeout(pending.timeoutId);
        pending.resolve('error');
      });
      pendingRequestsRef.current.clear();
    },
    []
  );

  const shareToStory = useCallback(async (imageBlob: Blob): Promise<InstagramStoryShareResultT> => {
    /** 연타 방지 — state 는 리렌더 후에야 반영돼 그 사이 클릭을 막지 못한다 */
    if (isSharingRef.current) return 'busy';

    try {
      const requestId = crypto.randomUUID();
      isSharingRef.current = true;
      setIsSharing(true);

      const base64 = await blobToBase64(imageBlob);

      const pendingPromise = new Promise<ShareInstagramStoryStatusT>(resolve => {
        const timeoutId = window.setTimeout(() => {
          pendingRequestsRef.current.delete(requestId);
          resolve('error');
        }, RESPONSE_TIMEOUT_MS);

        pendingRequestsRef.current.set(requestId, { resolve, timeoutId });
      });

      const isSent = WebBridge.postMessage({
        type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_SHARE_INSTAGRAM_STORY,
        payload: { requestId, base64, mimeType: imageBlob.type },
      });

      /** 앱 버전 게이트에 막히면 응답이 오지 않으므로 대기 상태를 직접 정리한다 */
      if (!isSent) {
        const pending = pendingRequestsRef.current.get(requestId);
        if (pending) window.clearTimeout(pending.timeoutId);
        pendingRequestsRef.current.delete(requestId);
        return 'blocked';
      }

      return await pendingPromise;
    } catch {
      return 'error';
    } finally {
      isSharingRef.current = false;
      setIsSharing(false);
    }
  }, []);

  return { shareToStory, isSharing };
};
