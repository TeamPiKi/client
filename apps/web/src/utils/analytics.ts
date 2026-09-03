import type { AnalyticsEventParamsT } from '@piki/core';
import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';

import type { AnalyticsEventNameT } from '@/consts/analytics';

import { WebBridge, isWebview } from './webBridge';

/** `@next/third-parties/google` 의 GoogleAnalytics 가 주입하는 전역 gtag 함수 */
type GtagT = {
  (command: 'event', name: string, params?: AnalyticsEventParamsT): void;
  (command: 'set', target: 'user_properties', params: AnalyticsEventParamsT): void;
};

/**
 * GA4 이벤트 로깅 — 환경별로 분기한다.
 *
 * - 웹뷰(앱) 안: webBridge 로 네이티브에 전달 → `@react-native-firebase/analytics` (모바일 스트림).
 * - 일반 브라우저: `gtag('event', ...)` 호출 → GA4 web 스트림.
 *
 * 두 스트림은 GA4 속성 안에서 통합 집계되어 한 대시보드에서 본다.
 *
 * GA4 정책:
 *  - 이벤트명: 40자 이내 snake_case
 *  - 파라미터: primitive(string/number/boolean) 만 허용
 *  - PII(이메일/닉네임/실명) 금지 — ID 만 보낸다
 *
 * 사용:
 * ```
 * logAnalyticsEvent(ANALYTICS_EVENT.TOURNAMENT_CREATE, { tournament_id: id });
 * ```
 */
export const logAnalyticsEvent = (name: AnalyticsEventNameT, params?: AnalyticsEventParamsT) => {
  if (isWebview()) {
    WebBridge.postMessage({
      type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_LOG_ANALYTICS_EVENT,
      payload: { name, params },
    });
    return;
  }

  // 일반 브라우저 — @next/third-parties 가 주입한 gtag 호출.
  // NEXT_PUBLIC_GA_ID 미설정 시 GoogleAnalytics 가 마운트 안 되므로 gtag 도 undefined.
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: GtagT }).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', name, params);
};

/**
 * GA4 사용자 속성 설정 — 이후 모든 이벤트에 자동으로 따라붙는다.
 *
 * 이벤트 파라미터와 달리 한 번 설정하면 그 사용자의 모든 이벤트에 실려서,
 * A/B 그룹별 후속 퍼널(완주율·공유율 등)을 추가 코드 없이 볼 수 있다.
 *
 * 앱(웹뷰)은 아직 브릿지 메시지가 없어 웹 스트림에서만 적용된다.
 */
export const setAnalyticsUserProperties = (params: AnalyticsEventParamsT) => {
  if (isWebview()) return;
  if (typeof window === 'undefined') return;

  const gtag = (window as unknown as { gtag?: GtagT }).gtag;
  if (typeof gtag !== 'function') return;

  gtag('set', 'user_properties', params);
};
