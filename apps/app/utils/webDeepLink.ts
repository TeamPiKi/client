/** 앱이 감싸는 웹앱의 호스트 — Universal Link / Smart App Banner app-argument 검증용 */
const WEB_HOSTS = ['piki.day', 'staging.piki.day', 'dev.piki.day'];

/**
 * 앱으로 가로채면 안 되는 경로. (iOS는 AASA exclude로도 막지만, Android App Link 는
 * assetlinks.json 에 exclude 가 없어 intentFilter 가 host 전체를 잡으므로 여기서 차단)
 * - /auth/callback/* : 소셜 로그인 콜백 — 앱이 가로채면 OAuth 흐름이 깨짐
 * - /api/*           : API / 백엔드 브릿지
 */
const EXCLUDED_PATH_PREFIXES = ['/auth/callback', '/api'];

const isExcludedPath = (pathname: string) =>
  EXCLUDED_PATH_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));

/**
 * 외부 https 링크(Universal Link)나 Smart App Banner의 app-argument 에서
 * 우리 웹 경로(pathname + search)를 추출한다. 우리 호스트가 아니거나 제외 경로면 null.
 *
 * 예) https://piki.day/tournament/join/123?code=abc → /tournament/join/123?code=abc
 */
export const extractWebPathFromUrl = (rawUrl: string): string | null => {
  try {
    const url = new URL(rawUrl);
    const isHttp = url.protocol === 'https:' || url.protocol === 'http:';

    if (isHttp && WEB_HOSTS.includes(url.hostname) && !isExcludedPath(url.pathname)) {
      return `${url.pathname}${url.search}`;
    }
  } catch {
    // 절대 URL 이 아니면 (커스텀 스킴 등) 호출부에서 다른 방식으로 처리
  }

  return null;
};
