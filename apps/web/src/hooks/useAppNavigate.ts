'use client';

import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useWebBridgeMessage } from '@/hooks/useWebBridgeMessage';
import isSafeInternalPath from '@/utils/isSafeInternalPath';

/** 목적지 경로가 끝내 커밋되지 않아도 오버레이가 계속 걸려있지 않도록 하는 안전장치(ms) */
const OVERLAY_TIMEOUT_MS = 5000;

/**
 * 앱(warm start 딥링크) → 웹 경로 이동 수신 핸들러
 * URI 리로드 대신 SPA 전환(router.push)으로 처리하고, 전환 중 로딩 오버레이 상태를 노출한다.
 * isPending 타이밍에 의존하지 않고, 메시지 수신 즉시 켜고 목적지 pathname 커밋 시 끈다.
 */
export const useAppNavigate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [targetPathname, setTargetPathname] = useState<string | null>(null);

  /** 목적지 pathname에 도달하면 파생적으로 false — effect 내 setState 없이 해제 */
  const isNavigatePending = targetPathname !== null && pathname !== targetPathname;

  useWebBridgeMessage(
    useCallback(
      message => {
        if (message.type !== WEBBRIDGE_MESSAGE_TYPE.APP_REQ_NAVIGATE) return;

        const { path } = message.payload;
        if (!isSafeInternalPath(path)) return;

        setTargetPathname(path.split(/[?#]/)[0] ?? path);
        router.push(path);
      },
      [router]
    )
  );

  /** 안전장치 — 일정 시간 내 목적지에 도달하지 못하면 오버레이 강제 해제 */
  useEffect(() => {
    if (!isNavigatePending) return;
    const timer = setTimeout(() => setTargetPathname(null), OVERLAY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isNavigatePending, targetPathname]);

  return { isNavigatePending };
};
