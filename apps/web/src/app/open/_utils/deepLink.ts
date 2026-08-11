import { APP_STORE_URL } from '@piki/core';

import { ANDROID_PACKAGE_NAME, DEFAULT_LANDING_TARGET } from '@/consts/appLink';
import { ROUTES } from '@/consts/route';

/** Play 스토어 URL — referrer 를 붙이면 설치 후 첫 실행에서 Install Referrer API 로 유입을 읽을 수 있다 */
export const buildAndroidStoreUrl = (source: string | null) =>
  source
    ? `${APP_STORE_URL.ANDROID}&referrer=${encodeURIComponent(`utm_source=${source}`)}`
    : APP_STORE_URL.ANDROID;

/**
 * 인스타 인앱 브라우저 탈출 URL — 지정한 주소를 외부 브라우저에서 연다.
 * 인스타 앱 자기 스킴이라 IAB 가 막지 않는다 (`piki://`·`itms-appss://` 는 막힌다).
 */
const buildInstagramExtBrowserUrl = (url: string) =>
  `instagram://extbrowser/?url=${encodeURIComponent(url)}`;

/**
 * iOS 진입 URL — 인스타가 외부 브라우저로 넘기는 순간 iOS 가 설치 여부를 판정한다.
 * 설치돼 있으면 Universal Link 로 앱이 열리고, 아니면 사파리가 `/open-app` 을 열어 앱스토어로 보낸다.
 */
export const buildIosAppOpenUrl = (serviceOrigin: string, target: string) => {
  const url = new URL(ROUTES.OPEN_APP, serviceOrigin);
  if (target !== DEFAULT_LANDING_TARGET) url.searchParams.set('to', target);

  return buildInstagramExtBrowserUrl(url.toString());
};

type BuildAndroidAppOpenUrlParamsT = {
  serviceOrigin: string;
  target: string;
  source: string | null;
};

/**
 * Android `intent://` URL — 미설치 판정을 OS 가 하므로 얼럿이 뜨지 않는다.
 * 설치돼 있으면 앱, 아니면 `browser_fallback_url` 로 플레이 스토어가 열린다.
 */
export const buildAndroidAppOpenUrl = ({
  serviceOrigin,
  target,
  source,
}: BuildAndroidAppOpenUrlParamsT) => {
  const { host } = new URL(serviceOrigin);

  return [
    `intent://${host}${target}#Intent`,
    'scheme=https',
    `package=${ANDROID_PACKAGE_NAME}`,
    `S.browser_fallback_url=${encodeURIComponent(buildAndroidStoreUrl(source))}`,
    'end',
  ].join(';');
};
