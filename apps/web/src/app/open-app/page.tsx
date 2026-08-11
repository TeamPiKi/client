import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DEFAULT_LANDING_TARGET, IOS_STORE_URL } from '@/consts/appLink';
import isSafeInternalPath from '@/utils/isSafeInternalPath';
import { isWebview } from '@/utils/webBridge';

import AppStoreRedirect from './_components/AppStoreRedirect';

export const metadata: Metadata = {
  title: 'PiKi 앱으로 열기',
  robots: { index: false, follow: false },
};

type OpenAppPageProps = {
  searchParams: Promise<{ to?: string }>;
};

/**
 * iOS 랜딩이 외부 브라우저로 넘기는 Universal Link 목적지.
 *
 * 앱이 설치돼 있으면 iOS 가 가로채서 이 페이지는 열리지 않는다.
 * 즉 여기까지 왔다는 건 미설치라는 뜻이라 앱스토어로 보내되,
 * 스토어 전환을 취소하고 남은 유저를 위해 화면은 남겨둔다.
 */
async function OpenAppPage({ searchParams }: OpenAppPageProps) {
  const { to } = await searchParams;
  const target = isSafeInternalPath(to) ? to : DEFAULT_LANDING_TARGET;

  const headerStore = await headers();

  /** 앱이 이 경로를 받아 웹뷰에 띄운 경우 — 이미 설치돼 있으므로 스토어로 보내면 안 된다 */
  if (isWebview(headerStore.get('user-agent'))) redirect(target);

  if (!IOS_STORE_URL) redirect(target);

  return <AppStoreRedirect storeUrl={IOS_STORE_URL} target={target} />;
}

export default OpenAppPage;
