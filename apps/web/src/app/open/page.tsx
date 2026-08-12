import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DEFAULT_LANDING_TARGET } from '@/consts/appLink';
import isSafeInternalPath from '@/utils/isSafeInternalPath';
import { toServiceHost } from '@/utils/landingHost';
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

  return (
    <OpenLanding
      landingEnv={landingEnv}
      target={target}
      serviceOrigin={serviceOrigin}
      source={utmSource ?? null}
    />
  );
}

export default OpenPage;
