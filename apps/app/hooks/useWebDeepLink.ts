import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { extractWebPathFromUrl } from '@/utils/webDeepLink';

const WEB_BASE_URL = process.env.EXPO_PUBLIC_WEB_URL;

const parseWebPath = (url: string): string | null => {
  /** Universal Link / Smart App Banner — 전체 https URL (https://piki.day/...) */
  const webFromUrl = extractWebPathFromUrl(url);
  if (webFromUrl) return webFromUrl;

  /** share extension — piki:///?web=/path */
  const { queryParams } = Linking.parse(url);
  const web = queryParams?.web;

  if (typeof web === 'string' && web.startsWith('/')) return web;
  if (Array.isArray(web) && typeof web[0] === 'string' && web[0].startsWith('/')) return web[0];

  return null;
};

const toWebviewUri = (webPath: string) => new URL(webPath, WEB_BASE_URL).toString();

type UseWebDeepLinkParams = {
  /** cold start — 웹뷰가 아직 로드 전이라 URI를 통째로 지정 (네이티브 스플래시가 로딩을 가림) */
  onColdStart: (uri: string) => void;
  /** warm start — 웹뷰가 이미 로드됨. 문서 리로드 대신 브릿지로 SPA 전환 유도 */
  onWarmStart: (path: string) => void;
};

/**
 * 딥링크를 웹뷰에 반영 (cold + warm start)
 * - share extension openHostApp `/?web=...`
 * - Universal Link / Smart App Banner(app-argument) `https://piki.day/...`
 *
 * cold start는 URI를 지정해 통째로 로드하고, warm start는 이미 로드된 웹뷰에
 * 경로만 전달해 SPA 전환시켜 "정지 → 하드 컷" 없이 부드럽게 이동시킨다.
 */
export const useWebDeepLink = ({ onColdStart, onWarmStart }: UseWebDeepLinkParams) => {
  const { web } = useLocalSearchParams<{ web?: string }>();

  /** cold start — Expo Router search param */
  useEffect(() => {
    if (typeof web !== 'string' || !web.startsWith('/')) return;

    onColdStart(toWebviewUri(web));
  }, [web, onColdStart]);

  /** warm start — 앱이 백그라운드에 있을 때 Linking 이벤트 */
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      const webPath = parseWebPath(url);
      if (!webPath) return;

      onWarmStart(webPath);
    };

    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription.remove();
  }, [onWarmStart]);
};
