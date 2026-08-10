/** Android 패키지명 — `intent://` 조립에 사용 */
export const ANDROID_PACKAGE_NAME = 'day.no30s.piki';

export const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;

/** 스토어 URL 이 없으면 스토어 CTA 를 렌더하지 않는다 */
export const IOS_STORE_URL = process.env.NEXT_PUBLIC_IOS_APP_STORE_ID
  ? `https://apps.apple.com/app/id${process.env.NEXT_PUBLIC_IOS_APP_STORE_ID}`
  : null;

/** 랜딩 기본 목적지 — `?to=` 가 없거나 안전하지 않으면 여기로 */
export const DEFAULT_LANDING_TARGET = '/';

/** Android 폴백으로 되돌아왔음을 나타내는 쿼리 키 — 붙어 있으면 `intent://` 재발사를 막는다 */
export const STORE_FALLBACK_PARAM = 'nf';

/** 시트가 먼저 그려지고 진입 이벤트가 나간 뒤 딥링크를 쏘기 위한 지연 (ms) */
export const AUTO_LAUNCH_DELAY_MS = 200;

/** 인앱 브라우저 UA 토큰 — 동작 분기가 아니라 유입 분석용 (IAB 에서는 UL 이 발동하지 않는다) */
export const IN_APP_BROWSER_UA_TOKENS = ['Instagram', 'Threads'] as const;
