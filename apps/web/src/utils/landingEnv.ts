import { IN_APP_BROWSER_UA_TOKENS } from '@/consts/appLink';

export type LandingPlatformT = 'ios' | 'android' | 'desktop';

export type InAppBrowserSourceT = 'kakao' | 'instagram' | 'threads';

export type LandingEnvT = {
  platform: LandingPlatformT;
  isInAppBrowser: boolean;
  isKakaoBrowser: boolean;
  isInstagramBrowser: boolean;
  inAppBrowserSource: InAppBrowserSourceT | null;
};

/**
 * NOTE: iPadOS 데스크톱 모드 UA 는 Macintosh 로 위장한다. 인앱 웹뷰는 `Mobile/` 토큰이 남아 구분되고,
 * 사파리 데스크톱 모드는 맥과 UA 가 같아 데스크톱으로 판정되지만 인앱이 아니라 결과는 같다.
 */
const getPlatform = (userAgent: string): LandingPlatformT => {
  if (/Android/i.test(userAgent)) return 'android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  if (/Macintosh/i.test(userAgent) && /Mobile\//i.test(userAgent)) return 'ios';
  return 'desktop';
};

export const isKakaoBrowser = (userAgent: string) => /KAKAOTALK/i.test(userAgent);

const isInstagramBrowser = (userAgent: string) => /Instagram/i.test(userAgent);

/** NOTE: 스레드 인앱 UA 는 내부 코드명 `Barcelona` 로 온다 */
const isThreadsBrowser = (userAgent: string) => /Threads|Barcelona/i.test(userAgent);

const getInAppBrowserSource = (userAgent: string): InAppBrowserSourceT | null => {
  if (isKakaoBrowser(userAgent)) return 'kakao';
  if (isInstagramBrowser(userAgent)) return 'instagram';
  if (isThreadsBrowser(userAgent)) return 'threads';
  return null;
};

export const getLandingEnv = (userAgent: string): LandingEnvT => ({
  platform: getPlatform(userAgent),
  isInAppBrowser: IN_APP_BROWSER_UA_TOKENS.some(token =>
    userAgent.toLowerCase().includes(token.toLowerCase())
  ),
  isKakaoBrowser: isKakaoBrowser(userAgent),
  isInstagramBrowser: isInstagramBrowser(userAgent),
  inAppBrowserSource: getInAppBrowserSource(userAgent),
});

/** 우리 앱 웹뷰·데스크톱은 튕길 필요가 없다 */
export const shouldEscapeInAppBrowser = (landingEnv: LandingEnvT, isWebview: boolean) =>
  !isWebview && landingEnv.isInAppBrowser && landingEnv.platform !== 'desktop';
