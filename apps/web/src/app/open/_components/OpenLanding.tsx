'use client';

import { useEffect } from 'react';

import PikiLogo from '@/assets/images/piki-logo-cart.svg';
import BottomCta from '@/components/bottom-cta';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { AUTO_LAUNCH_DELAY_MS } from '@/consts/appLink';
import { logAnalyticsEvent } from '@/utils/analytics';

import { buildAndroidAppOpenUrl, buildIosAppOpenUrl } from '../_utils/deepLink';
import type { LandingEnvT } from '../_utils/landingEnv';

type OpenLandingProps = {
  landingEnv: LandingEnvT;
  /** 검증된 내부 경로 */
  target: string;
  /** 앱 링크가 발동하는 서비스 오리진 (piki.day) — 프리뷰 등 미등록 호스트는 여기서 정규화된다 */
  serviceOrigin: string;
  source: string | null;
};

/** 루트 스플래시와 같은 로고 크기 — 원본 146px 을 116px 로 줄인 비율 */
const SPLASH_LOGO_SCALE = 116 / 146;

/** 앱을 여는 URL — 설치 여부 판정은 전부 OS 에 맡긴다 (웹에는 감지 수단이 없다) */
const getAppOpenUrl = ({ landingEnv, target, serviceOrigin, source }: OpenLandingProps) => {
  const { platform, isInstagramBrowser } = landingEnv;

  if (platform === 'android') return buildAndroidAppOpenUrl({ serviceOrigin, target, source });
  if (platform === 'ios' && isInstagramBrowser) return buildIosAppOpenUrl(serviceOrigin, target);

  /** 인스타 밖에서 열린 iOS — 스킴을 쏘면 얼럿이 뜨므로 웹으로 넘긴다 */
  return null;
};

function OpenLanding({ landingEnv, target, serviceOrigin, source }: OpenLandingProps) {
  const { platform, isInAppBrowser } = landingEnv;

  const webUrl = `${serviceOrigin}${target}`;
  const appOpenUrl = getAppOpenUrl({ landingEnv, target, serviceOrigin, source });

  useEffect(() => {
    logAnalyticsEvent(ANALYTICS_EVENT.LANDING_VIEW, {
      platform,
      in_app_browser: isInAppBrowser,
      ...(source && { source }),
    });
  }, [platform, isInAppBrowser, source]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!appOpenUrl) {
        window.location.replace(webUrl);
        return;
      }

      logAnalyticsEvent(ANALYTICS_EVENT.LANDING_APP_OPEN, { platform });
      window.location.href = appOpenUrl;
    }, AUTO_LAUNCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [appOpenUrl, webUrl, platform]);

  /** `<Link>` 가 아닌 JS 이동 — UL 을 건드리지 않고 확실히 웹으로만 보낸다 */
  const handleWebContinueClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.LANDING_WEB_CONTINUE, { platform });
    window.location.href = webUrl;
  };

  return (
    /** 루트(`/`)의 스플래시와 같은 화면 — 앱·스토어 전환을 기다리는 동안만 보인다 */
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

      {/** 자동 전환이 막힌 환경(구버전 인스타 등)에서 웹으로 빠져나갈 길 */}
      <BottomCta className="justify-center bg-transparent pb-10">
        <button
          type="button"
          onClick={handleWebContinueClick}
          className="cursor-pointer px-5 py-3 body-2-medium text-text-neutral-tertiary underline"
        >
          웹으로 계속 보기
        </button>
      </BottomCta>
    </main>
  );
}

export default OpenLanding;
