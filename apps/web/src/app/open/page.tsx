import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DEFAULT_LANDING_TARGET, INSTAGRAM_SOURCE } from '@/consts/appLink';
import isSafeInternalPath from '@/utils/isSafeInternalPath';
import { toServiceHost } from '@/utils/serviceHost';
import { isWebview } from '@/utils/webBridge';

import OpenLanding from './_components/OpenLanding';
import { getLandingEnv } from './_utils/landingEnv';

/** 인스타 프로필에서만 쓰는 진입 링크라 검색 노출은 piki.day 로 몰아준다 */
export const metadata: Metadata = {
  title: 'PiKi 앱으로 열기',
  robots: { index: false, follow: false },
};

type OpenPageProps = {
  searchParams: Promise<{ to?: string; utm_source?: string }>;
};

async function OpenPage({ searchParams }: OpenPageProps) {
  const { to, utm_source: utmSource } = await searchParams;

  const headerStore = await headers();
  const userAgent = headerStore.get('user-agent') ?? '';
  const host = headerStore.get('host') ?? '';
  const protocol = headerStore.get('x-forwarded-proto') ?? 'https';

  /** 함정 4 — 내부 경로만 허용해 오픈 리다이렉트를 막는다 */
  const target = isSafeInternalPath(to) ? to : DEFAULT_LANDING_TARGET;

  const serviceOrigin = `${protocol}://${toServiceHost(host)}`;

  /** 앱 웹뷰·데스크톱은 분기할 게 없으니 서비스 오리진으로 바로 보낸다 */
  const landingEnv = getLandingEnv(userAgent);
  if (isWebview(userAgent) || landingEnv.platform === 'desktop') {
    redirect(`${serviceOrigin}${target}`);
  }

  /**
   * 유입 소스 — 인스타 바이오에 `?utm_source=instagram` 없이 깔끔한 링크를 걸기 위해
   * 인앱 브라우저 UA 로도 판정한다. 바이오 탭은 인스타 인앱 브라우저로 열리므로
   * 이 랜딩에 도달하는 시점엔 아직 UA 에 `Instagram` 토큰이 남아 있다.
   * 쿼리로 들어온 값이 있으면 그쪽이 우선 — 다른 채널을 붙일 때 그대로 쓴다.
   */
  const source = utmSource ?? (landingEnv.isInstagramBrowser ? INSTAGRAM_SOURCE : null);

  return (
    <OpenLanding
      landingEnv={landingEnv}
      target={target}
      serviceOrigin={serviceOrigin}
      source={source}
    />
  );
}

export default OpenPage;
