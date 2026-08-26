import { APP_STORE_URL } from '@piki/core';

import { ANDROID_PACKAGE_NAME, DEFAULT_LANDING_TARGET } from '@/consts/appLink';
import { ROUTES } from '@/consts/route';

import type { LandingEnvT } from './landingEnv';

/** referrer 를 붙이면 설치 후 첫 실행에서 Install Referrer API 로 유입을 읽을 수 있다 */
export const buildAndroidStoreUrl = (source: string | null) =>
  source
    ? `${APP_STORE_URL.ANDROID}&referrer=${encodeURIComponent(`utm_source=${source}`)}`
    : APP_STORE_URL.ANDROID;

/** NOTE: 인스타 자기 스킴만 IAB 가 막지 않는다 (`piki://`·`itms-appss://` 는 막힌다) */
export const buildInstagramExtBrowserUrl = (url: string) =>
  `instagram://extbrowser/?url=${encodeURIComponent(url)}`;

/** NOTE: 비공개 스킴 — 카톡 업데이트로 막힐 수 있어 호출부에 웹 폴백이 있어야 한다 */
export const buildKakaoExternalUrl = (url: string) =>
  `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;

export const buildOpenAppPath = (target: string) => {
  if (target === DEFAULT_LANDING_TARGET) return ROUTES.OPEN_APP;
  return `${ROUTES.OPEN_APP}?to=${encodeURIComponent(target)}`;
};

type BuildAndroidAppOpenUrlParamsT = {
  origin: string;
  target: string;
  fallbackUrl: string;
};

export const buildAndroidAppOpenUrl = ({
  origin,
  target,
  fallbackUrl,
}: BuildAndroidAppOpenUrlParamsT) => {
  const { host } = new URL(origin);

  return [
    `intent://${host}${target}#Intent`,
    'scheme=https',
    `package=${ANDROID_PACKAGE_NAME}`,
    `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}`,
    'end',
  ].join(';');
};

type BuildInAppBrowserEscapeUrlParamsT = {
  landingEnv: LandingEnvT;
  origin: string;
  /** pathname + search */
  currentPath: string;
  utmSource: string | null;
};

/**
 * 미설치자 목적지는 유입 성격으로 가른다.
 * - 공유 링크: 현재 URL → 웹 (스마트 배너로 설치 유도)
 * - `utm_source` 마케팅 진입: `/open-app` → 스토어
 * 설치자는 둘 다 UL 로 앱이 열린다.
 */
export const buildInAppBrowserEscapeUrl = ({
  landingEnv,
  origin,
  currentPath,
  utmSource,
}: BuildInAppBrowserEscapeUrlParamsT) => {
  const { platform, isKakaoBrowser, isInAppBrowser } = landingEnv;
  if (!isInAppBrowser || platform === 'desktop') return null;

  const isMarketingEntry = utmSource !== null;
  const target = isMarketingEntry ? buildOpenAppPath(currentPath) : currentPath;
  const escapeUrl = `${origin}${target}`;

  if (isKakaoBrowser) return buildKakaoExternalUrl(escapeUrl);

  if (platform === 'android') {
    return buildAndroidAppOpenUrl({
      origin,
      target,
      fallbackUrl: isMarketingEntry ? buildAndroidStoreUrl(utmSource) : escapeUrl,
    });
  }

  /** NOTE: iOS 스레드도 인스타 스킴으로 시도한다 — 막히면 "웹으로 계속 보기" 폴백 */
  return buildInstagramExtBrowserUrl(escapeUrl);
};
