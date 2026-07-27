import { WEBVIEW_UA_TOKEN } from '@piki/core';

const APP_VERSION_PATTERN = new RegExp(`${WEBVIEW_UA_TOKEN}/([\\d.]+)`, 'i');

const parseAppVersion = (userAgent: string) => {
  const match = userAgent.match(APP_VERSION_PATTERN);
  return match?.[1] ?? null;
};

/**
 * UA의 `PIKI_APP/<version>` 토큰에서 앱 버전 추출
 *
 * @param userAgentFromServer 서버 환경일 때 전달받은 user-agent
 * @returns 앱이 아니거나 버전 토큰이 없으면 null
 *
 * @example 클라이언트 환경일 때
 * getAppVersion()
 *
 * @example 서버 환경일 때
 * const headerStore = await headers();
 * getAppVersion(headerStore.get('user-agent'))
 */
export const getAppVersion = (userAgentFromServer: string | null = null) => {
  /** 클라이언트 환경일 때 */
  if (typeof window !== 'undefined') return parseAppVersion(navigator.userAgent);

  /** 서버 환경일 때 */
  if (userAgentFromServer) return parseAppVersion(userAgentFromServer);

  /** 앱이 아니거나 버전 토큰이 없을 때 */
  return null;
};

const toVersionParts = (version: string) =>
  version.split('.').map(part => {
    const parsed = Number(part);
    return Number.isFinite(parsed) ? parsed : 0;
  });

/**
 * 버전 비교
 * - a > b 면 1
 * - a < b 면 -1
 * - a = b 면 0
 *
 * @example
 * compareVersion('1.10.0', '1.9.0') // 1
 * compareVersion('1.9.0', '1.10.0') // -1
 * compareVersion('1.10.0', '1.10.0') // 0
 * 문자열 비교는 `'1.10.0' < '1.9.0'` 이 되어버리므로 파트별 숫자로 비교한다.
 * 자리수가 다르면 없는 자리를 0으로 취급 ('1.1' === '1.1.0').
 */
const compareVersion = (a: string, b: string) => {
  const aParts = toVersionParts(a);
  const bParts = toVersionParts(b);
  const length = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < length; i += 1) {
    const diff = (aParts[i] ?? 0) - (bParts[i] ?? 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }

  return 0;
};

/**
 * 현재 앱 버전이 요구되는 최소 버전 이상인지 확인
 *
 * @param appVersion 현재 앱 버전
 * @param minVersion 요구되는 최소 버전
 * @returns 현재 앱 버전이 요구되는 최소 버전 이상인지 여부
 *
 * @example
 * isAppVersionSupported('1.0.5', '1.1.0') // false
 * isAppVersionSupported('1.10.0', '1.9.0') // true
 * isAppVersionSupported('1.10.0', '1.10.0') // true
 */
export const isAppVersionSupported = (appVersion: string | null, minVersion: string) => {
  if (!appVersion) return false;
  return compareVersion(appVersion, minVersion) >= 0;
};
