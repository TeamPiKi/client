'use client';

import { useEffect, useState } from 'react';

import PikiLogo from '@/assets/images/piki-logo-cart.svg';
import Button from '@/components/button';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { logAnalyticsEvent } from '@/utils/analytics';

import { AUTO_LAUNCH_DELAY_MS, IOS_STORE_URL } from '../_consts/appLink';
import {
  buildAndroidStoreUrl,
  buildIntentUrl,
  buildUniversalLinkUrl,
} from '../_utils/deepLink';
import type { LandingEnvT } from '../_utils/landingEnv';
import AppOpenSheet from './AppOpenSheet';

type OpenLandingProps = {
  landingEnv: LandingEnvT;
  /** 검증된 내부 경로 */
  target: string;
  /** 실제 서비스 오리진 (piki.day) — 랜딩 오리진과 크로스 도메인이어야 UL 이 산다 */
  serviceOrigin: string;
  storeFallbackUrl: string;
  /** Android `intent://` 폴백으로 되돌아온 진입인지 — 재발사를 막는다 */
  isStoreFallbackReturn: boolean;
  source: string | null;
};

/** 루트 스플래시와 같은 로고 크기 — 원본 146px 을 200px 로 키운 비율 */
const SPLASH_LOGO_SCALE = 200 / 146;

/** 앱을 여는 URL — 둘 다 미설치 판정을 OS 가 하므로 설치 감지가 필요 없다 */
const getAppOpenUrl = ({
  landingEnv,
  target,
  serviceOrigin,
  storeFallbackUrl,
}: Pick<OpenLandingProps, 'landingEnv' | 'target' | 'serviceOrigin' | 'storeFallbackUrl'>) => {
  if (landingEnv.platform === 'android') {
    return buildIntentUrl({ serviceOrigin, target, fallbackUrl: storeFallbackUrl });
  }
  if (landingEnv.platform === 'ios') return buildUniversalLinkUrl(serviceOrigin, target);

  return null;
};

function OpenLanding({
  landingEnv,
  target,
  serviceOrigin,
  storeFallbackUrl,
  isStoreFallbackReturn,
  source,
}: OpenLandingProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  const { platform, isInAppBrowser } = landingEnv;
  const webUrl = `${serviceOrigin}${target}`;

  /** 미설치가 확인된 복귀(`nf=1`)에서는 앱 열기를 감춘다 */
  const appOpenUrl = isStoreFallbackReturn
    ? null
    : getAppOpenUrl({ landingEnv, target, serviceOrigin, storeFallbackUrl });

  const storeUrl = (() => {
    if (platform === 'ios') return IOS_STORE_URL;
    if (platform === 'android') return buildAndroidStoreUrl(source);
    return null;
  })();

  /**
   * 자동 발사는 Android `intent://` 만 — OS 가 미설치를 판정해 fallbackUrl 로 되돌려준다.
   * iOS 는 Universal Link 라 `<a>` 탭이 있어야 발동하고, `nf=1` 복귀는 무한루프라 제외한다.
   */
  const autoLaunchUrl = !isStoreFallbackReturn && platform === 'android' ? appOpenUrl : null;

  useEffect(() => {
    logAnalyticsEvent(ANALYTICS_EVENT.LANDING_VIEW, {
      platform,
      in_app_browser: isInAppBrowser,
      store_fallback: isStoreFallbackReturn,
      ...(source && { source }),
    });
  }, [platform, isInAppBrowser, isStoreFallbackReturn, source]);

  useEffect(() => {
    if (!autoLaunchUrl) return;

    const timer = setTimeout(() => {
      logAnalyticsEvent(ANALYTICS_EVENT.LANDING_APP_OPEN, { platform, trigger: 'auto' });
      window.location.href = autoLaunchUrl;
    }, AUTO_LAUNCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [autoLaunchUrl, platform]);

  /** 앱으로 전환되면 시트를 닫아 복귀 시 잔상을 없앤다 */
  useEffect(() => {
    const handleHide = () => {
      if (document.visibilityState === 'hidden') setIsSheetOpen(false);
    };

    document.addEventListener('visibilitychange', handleHide);
    return () => document.removeEventListener('visibilitychange', handleHide);
  }, []);

  const handleAppOpenClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.LANDING_APP_OPEN, { platform, trigger: 'tap' });
  };

  const handleStoreClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.LANDING_STORE_CLICK, { platform });
  };

  /** 함정 1 — JS 이동이라야 크로스 도메인 UL 이 발동하지 않고 웹으로 간다 */
  const handleWebContinueClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.LANDING_WEB_CONTINUE, { platform });
    window.location.href = webUrl;
  };

  return (
    /** 루트(`/`)의 스플래시와 같은 화면 — 자동 이동만 뺐다 (이동하면 시트가 사라진다) */
    <main
      className="relative"
      style={{ height: '100dvh', width: '100%', backgroundColor: '#FAFAFA' }}
    >
      <div
        className="fixed left-1/2 top-1/2 z-10"
        style={{ transform: `translate(-50%, -50%) scale(${SPLASH_LOGO_SCALE})` }}
      >
        <PikiLogo
          aria-label="PiKi"
          className="block h-[106px] w-[146px] shrink-0 text-sky-blue-400"
        />
      </div>

      {!isSheetOpen && (
        <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-120 px-5 pb-10">
          <Button size="lg" onClick={() => setIsSheetOpen(true)}>
            앱으로 열기
          </Button>
        </div>
      )}

      <AppOpenSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        appOpenUrl={appOpenUrl}
        storeUrl={storeUrl}
        onAppOpenClick={handleAppOpenClick}
        onStoreClick={handleStoreClick}
        onWebContinueClick={handleWebContinueClick}
      />
    </main>
  );
}

export default OpenLanding;
