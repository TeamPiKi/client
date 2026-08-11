import { APP_STORE_URL, WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';

import { WebBridge } from '@/utils/webBridge';

/** 목표 버전이 오르면 같은 세션에서도 다시 노출되도록 키에 버전을 포함한다 */
const getDismissKey = (targetVersion: string) => `piki:app-update:${targetVersion}`;

/** 이번 앱 실행(세션)에서 업데이트 유도 모달을 닫았는지 — sessionStorage 는 앱 종료 시 비워진다 */
export const hasDismissedAppUpdate = (targetVersion: string) => {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(getDismissKey(targetVersion)) === '1';
  } catch {
    return false;
  }
};

/** 업데이트 유도 모달 닫음 표시 */
export const markAppUpdateDismissed = (targetVersion: string) => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(getDismissKey(targetVersion), '1');
  } catch {
    /** private mode 등 — 무시 */
  }
};

/**
 * 스토어 상세 페이지로 이동 — 브릿지 우선, 실패 시 웹에서 직접 URL 이동.
 *
 * 이 모달의 대상은 구버전 앱이라 WEB_REQ_OPEN_STORE 핸들러가 없어 게이트에 막힌다.
 * URL 직접 이동이 사실상 1차 경로이고, 브릿지는 다음 유도부터 쓰이는 보강책이다.
 */
export const openAppStore = () => {
  if (typeof window === 'undefined') return;

  const isSent = WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_OPEN_STORE });
  if (isSent) return;

  const isAndroid = /android/i.test(window.navigator.userAgent);
  window.location.href = isAndroid ? APP_STORE_URL.ANDROID : APP_STORE_URL.IOS;
};
