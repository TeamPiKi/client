import { getShareExtensionKey } from 'expo-share-intent';

import { extractWebPathFromUrl } from '@/utils/webDeepLink';

/**
 * 시스템 딥링크를 Expo Router 경로로 변환 (cold start)
 *
 * - expo-share-intent: piki://dataUrl=... → /
 * - share extension: piki:///?web=... → /?web=... (`web`은 `/`로 시작하는 웹 경로)
 * - Universal Link / Smart App Banner(app-argument): https://piki.day/... → /?web=<경로>
 *
 * 어느 경로든 `/?web=<웹 경로>` 형태로 정규화 → useWebDeepLink 가 WebView URI로 반영
 */
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  /** share intent 딥링크 — 네이티브 라우트 해석 없이 루트로 보냄 */
  if (path.includes(`dataUrl=${getShareExtensionKey()}`)) return '/';

  /** Universal Link / Smart App Banner — 전체 https URL 에서 웹 경로 추출 */
  const webFromUrl = extractWebPathFromUrl(path);
  if (webFromUrl) return `/?web=${encodeURIComponent(webFromUrl)}`;

  try {
    /** share extension → openHostApp(`/?web=${encodeURIComponent('/archive?tab=wish')}`) */
    const url = new URL(path, 'piki://app');
    const web = url.searchParams.get('web');

    if (web?.startsWith('/')) return `/?web=${encodeURIComponent(web)}`;
  } catch {
    return path;
  }

  return path;
}
