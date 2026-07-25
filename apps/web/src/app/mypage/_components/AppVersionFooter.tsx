import { headers } from 'next/headers';

import { ShoppingBagIconFill } from '@/assets/icons';
import { getAppVersion } from '@/utils/appVersion';
import { isWebview } from '@/utils/webBridge';

async function AppVersionFooter() {
  const webVersion = process.env.NEXT_PUBLIC_WEB_VERSION;
  if (!webVersion) return null;

  const headerStore = await headers();
  const userAgent = headerStore.get('user-agent');
  const isWebviewEnv = isWebview(userAgent);
  const appVersion = getAppVersion(userAgent);

  const versionLabel =
    isWebviewEnv && appVersion ? `v${appVersion} (w${webVersion})` : `v${webVersion}`;

  return (
    <div className="flex h-5 items-center gap-2 pl-5">
      <ShoppingBagIconFill className="size-5 shrink-0 text-text-neutral-tertiary" aria-hidden />
      <p className="body-2-medium text-text-neutral-tertiary">{versionLabel}</p>
    </div>
  );
}

export default AppVersionFooter;
