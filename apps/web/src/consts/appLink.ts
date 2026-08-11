/** Android 패키지명 — `intent://` 조립에 사용 */
export const ANDROID_PACKAGE_NAME = 'day.no30s.piki';

export const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;

/** 없으면 스토어 대신 웹으로 폴백한다 */
export const IOS_STORE_URL = process.env.NEXT_PUBLIC_IOS_APP_STORE_ID
  ? `https://apps.apple.com/kr/app/id${process.env.NEXT_PUBLIC_IOS_APP_STORE_ID}`
  : null;

/** `?to=` 가 없거나 안전하지 않을 때의 목적지 */
export const DEFAULT_LANDING_TARGET = '/';

/** 로고가 한 프레임 그려진 뒤 발사해 흰 화면이 스치지 않게 한다 (ms) */
export const AUTO_LAUNCH_DELAY_MS = 200;

/** 인앱 브라우저 UA 토큰 — 동작 분기가 아니라 유입 분석용 */
export const IN_APP_BROWSER_UA_TOKENS = ['Instagram', 'Threads'] as const;
