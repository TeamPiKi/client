import { headers } from 'next/headers';

import { isWebview } from '@/utils/webBridge';

/**
 * RSC 전용. User-Agent 로 앱(웹뷰) 여부를 판정한다.
 *
 * 클라이언트에서 `useSyncExternalStore` 로 판정하면 hydration 후에야 값이 정해져
 * 앱 전용 UI 가 뒤늦게 나타난다. 서버에서 미리 내려주면 첫 렌더부터 확정된다.
 */
export const getIsApp = async (): Promise<boolean> => {
  const userAgent = (await headers()).get('user-agent');

  return isWebview(userAgent);
};
