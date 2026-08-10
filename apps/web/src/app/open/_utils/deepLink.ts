import { ANDROID_PACKAGE_NAME, ANDROID_STORE_URL } from '../_consts/appLink';

/**
 * Universal Link URL — 랜딩과 크로스 도메인이라 iOS Safari/Chrome 에서 앱이 열린다.
 * 미설치면 얼럿 없이 그냥 그 웹페이지가 열려, 설치 여부 분기를 OS 가 대신해준다.
 */
export const buildUniversalLinkUrl = (serviceOrigin: string, target: string) =>
  `${serviceOrigin}${target}`;

type BuildIntentUrlParamsT = {
  serviceOrigin: string;
  target: string;
  fallbackUrl: string;
};

/**
 * Android `intent://` URL — 미설치 판정을 OS 가 하므로 얼럿이 뜨지 않는다.
 * fallbackUrl 은 스토어가 아니라 랜딩으로 되돌려 "웹으로 계속 보기" 를 남긴다.
 */
export const buildIntentUrl = ({ serviceOrigin, target, fallbackUrl }: BuildIntentUrlParamsT) => {
  const { host } = new URL(serviceOrigin);

  return [
    `intent://${host}${target}#Intent`,
    'scheme=https',
    `package=${ANDROID_PACKAGE_NAME}`,
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}`,
    'end',
  ].join(';');
};

/** Play 스토어 URL — referrer 를 붙이면 설치 후 첫 실행에서 Install Referrer API 로 유입을 읽을 수 있다 */
export const buildAndroidStoreUrl = (source: string | null) =>
  source
    ? `${ANDROID_STORE_URL}&referrer=${encodeURIComponent(`utm_source=${source}`)}`
    : ANDROID_STORE_URL;
