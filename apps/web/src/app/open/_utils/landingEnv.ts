import { IN_APP_BROWSER_UA_TOKENS } from '../_consts/appLink';

export type LandingPlatformT = 'ios' | 'android' | 'desktop';

export type LandingEnvT = {
  platform: LandingPlatformT;
  /** 인스타/스레드 인앱 브라우저 여부 — Universal Link 가 발동하지 않아 스킴이 유일한 수단 */
  isInAppBrowser: boolean;
};

/** iPadOS 데스크톱 모드 UA 는 Macintosh 로 위장하므로 서버에서는 데스크톱으로 판정된다 */
const getPlatform = (userAgent: string): LandingPlatformT => {
  if (/Android/i.test(userAgent)) return 'android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  return 'desktop';
};

/** UA 기반 랜딩 환경 판정 — SSR 에서 계산해 시트를 첫 HTML 에 담는다 */
export const getLandingEnv = (userAgent: string): LandingEnvT => ({
  platform: getPlatform(userAgent),
  isInAppBrowser: IN_APP_BROWSER_UA_TOKENS.some(token => userAgent.includes(token)),
});
