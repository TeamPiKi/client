/** Android 패키지명 — `intent://` 의 package 지정에 쓴다 (스토어 URL 은 @piki/core 의 APP_STORE_URL) */
export const ANDROID_PACKAGE_NAME = 'day.no30s.piki';

/** `?to=` 가 없거나 안전하지 않을 때의 목적지 */
export const DEFAULT_LANDING_TARGET = '/';

/** 로고가 한 프레임 그려진 뒤 발사해 흰 화면이 스치지 않게 한다 (ms) */
export const AUTO_LAUNCH_DELAY_MS = 200;

/** 인앱 브라우저 UA 토큰 — UL 이 발동하지 않아 외부 브라우저로 탈출시킨다 (`Barcelona` = 스레드) */
export const IN_APP_BROWSER_UA_TOKENS = ['KAKAOTALK', 'Instagram', 'Threads', 'Barcelona'] as const;

/** 인스타 유입 소스 값 — GA4 이벤트 파라미터와 Play 스토어 referrer 에 같은 값이 나가야 한다 */
export const INSTAGRAM_SOURCE = 'instagram';
