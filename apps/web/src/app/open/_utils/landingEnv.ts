import { IN_APP_BROWSER_UA_TOKENS } from '@/consts/appLink';

export type LandingPlatformT = 'ios' | 'android' | 'desktop';

export type LandingEnvT = {
  platform: LandingPlatformT;
  /** 인스타/스레드 인앱 브라우저 여부 — Universal Link 가 발동하지 않아 스킴이 유일한 수단 */
  isInAppBrowser: boolean;
  /** 인스타 인앱 브라우저 — `instagram://extbrowser` 로만 외부 브라우저로 빠져나갈 수 있다 */
  isInstagramBrowser: boolean;
};

/**
 * iPadOS 데스크톱 모드 UA 는 Macintosh 로 위장한다.
 * 인앱 웹뷰는 `Mobile/` 토큰이 남아 구분되지만(맥 브라우저엔 없는 토큰),
 * 사파리 데스크톱 모드는 맥과 UA 가 완전히 같아 서버에서는 데스크톱으로 판정된다.
 * 후자는 인스타 밖 iOS 와 동선이 같아(웹 이동) 판정이 갈려도 결과는 동일하다.
 */
const getPlatform = (userAgent: string): LandingPlatformT => {
  if (/Android/i.test(userAgent)) return 'android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  if (/Macintosh/i.test(userAgent) && /Mobile\//i.test(userAgent)) return 'ios';
  return 'desktop';
};

/** UA 기반 랜딩 환경 판정 — SSR 에서 계산해 시트를 첫 HTML 에 담는다 */
export const getLandingEnv = (userAgent: string): LandingEnvT => ({
  platform: getPlatform(userAgent),
  isInAppBrowser: IN_APP_BROWSER_UA_TOKENS.some(token => userAgent.includes(token)),
  isInstagramBrowser: /Instagram/i.test(userAgent),
});
