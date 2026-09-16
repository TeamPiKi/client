import { WEBVIEW_UA_TOKEN } from '@piki/core';
import { headers } from 'next/headers';

import SplashClient from './_components/SplashClient';

async function Page() {
  /** 로그인 화면과 같은 조건 — 앵커의 버튼 개수를 맞춰야 로고 착지 좌표가 어긋나지 않는다 */
  const userAgent = (await headers()).get('user-agent') ?? '';
  const isAndroidWebview = userAgent.includes(WEBVIEW_UA_TOKEN) && /android/i.test(userAgent);

  return <SplashClient showAppleLogin={!isAndroidWebview} />;
}

export default Page;
