import { ROUTES } from '@/consts/route';
import { isLandingHost } from '@/utils/landingHost';

import { DEFAULT_LANDING_TARGET, STORE_FALLBACK_PARAM } from '../_consts/appLink';

type BuildStoreFallbackUrlParamsT = {
  landingOrigin: string;
  target: string;
  source: string | null;
};

/**
 * Android `intent://` 미설치 폴백으로 돌아올 랜딩 URL.
 *
 * 랜딩 서브도메인은 미들웨어가 `/` 를 `/open` 으로 rewrite 하므로 경로가 갈린다.
 * `nf=1` 을 붙여 복귀 시 재발사를 막는다 (무한루프 방지).
 */
export const buildStoreFallbackUrl = ({
  landingOrigin,
  target,
  source,
}: BuildStoreFallbackUrlParamsT) => {
  const { host } = new URL(landingOrigin);
  const url = new URL(isLandingHost(host) ? ROUTES.ROOT : ROUTES.OPEN, landingOrigin);

  url.searchParams.set(STORE_FALLBACK_PARAM, '1');
  if (target !== DEFAULT_LANDING_TARGET) url.searchParams.set('to', target);
  if (source) url.searchParams.set('utm_source', source);

  return url.toString();
};
