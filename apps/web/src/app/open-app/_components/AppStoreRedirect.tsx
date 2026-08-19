'use client';

import { useEffect, useState } from 'react';

import PikiLogo from '@/assets/images/piki-logo-cart.svg';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { AUTO_LAUNCH_DELAY_MS } from '@/consts/appLink';
import { logAnalyticsEvent } from '@/utils/analytics';

type AppStoreRedirectProps = {
  storeUrl: string;
  /** 검증된 내부 경로 — 이 페이지는 이미 서비스 오리진이라 상대 이동이면 된다 */
  target: string;
};

/** 루트 스플래시와 같은 로고 크기 — 원본 146px 을 116px 로 줄인 비율 */
const SPLASH_LOGO_SCALE = 116 / 146;

function AppStoreRedirect({ storeUrl, target }: AppStoreRedirectProps) {
  /** 스토어 전환을 취소하고 남은 유저에게만 CTA 를 보여준다 — 전환 전에는 로고만 */
  const [hasAttemptedStore, setHasAttemptedStore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      logAnalyticsEvent(ANALYTICS_EVENT.LANDING_STORE_OPEN, { platform: 'ios' });
      setHasAttemptedStore(true);
      window.location.href = storeUrl;
    }, AUTO_LAUNCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [storeUrl]);

  const handleStoreRetryClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.LANDING_STORE_OPEN, { platform: 'ios', trigger: 'retry' });
    window.location.href = storeUrl;
  };

  const handleWebContinueClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.LANDING_WEB_CONTINUE, { platform: 'ios' });
    window.location.href = target;
  };

  return (
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

      {hasAttemptedStore && (
        <BottomCta className="flex-col items-stretch gap-2 bg-transparent pb-10">
          <Button size="lg" onClick={handleStoreRetryClick}>
            앱 설치하러 가기
          </Button>
          <Button variant="secondary" size="lg" onClick={handleWebContinueClick}>
            웹으로 계속 보기
          </Button>
        </BottomCta>
      )}
    </main>
  );
}

export default AppStoreRedirect;
