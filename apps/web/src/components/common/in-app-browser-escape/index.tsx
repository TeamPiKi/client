'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';

import PikiLogo from '@/assets/images/piki-logo-cart.svg';
import BottomCta from '@/components/bottom-cta';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { AUTO_LAUNCH_DELAY_MS } from '@/consts/appLink';
import { Z_INDEX } from '@/consts/zIndex';
import { logAnalyticsEvent } from '@/utils/analytics';
import { buildInAppBrowserEscapeUrl } from '@/utils/deepLink';
import {
  hasAttemptedInAppBrowserEscape,
  isInAppBrowserEscapeExcludedPath,
  markInAppBrowserEscapeAttempted,
} from '@/utils/inAppBrowserEscape';
import isSafeInternalPath from '@/utils/isSafeInternalPath';
import type { LandingEnvT } from '@/utils/landingEnv';

type InAppBrowserEscapeProps = {
  landingEnv: LandingEnvT;
};

/** 루트 스플래시와 같은 로고 크기 — 원본 146px 을 116px 로 */
const SPLASH_LOGO_SCALE = 116 / 146;

/**
 * 인앱 브라우저는 UL 을 무시하므로 자기 스킴으로 외부 브라우저에 다시 열어 OS 가 설치 여부를 판정하게 한다.
 * 튕기는 동안 본문이 보이지 않도록 스플래시로 덮고, 세션당 한 번만 시도한다.
 */
function InAppBrowserEscape({ landingEnv }: InAppBrowserEscapeProps) {
  const pathname = usePathname();
  const { platform, isInAppBrowser, inAppBrowserSource } = landingEnv;

  const isExcluded = isInAppBrowserEscapeExcludedPath(pathname);
  /** NOTE: 서버 스냅샷은 false — SSR 에선 세션을 알 수 없어 일단 덮고 하이드레이션 후 내린다 */
  const hasAttempted = useSyncExternalStore(
    () => () => {},
    hasAttemptedInAppBrowserEscape,
    () => false
  );
  const [isDismissed, setIsDismissed] = useState(false);

  const isActive = !isExcluded && !hasAttempted && !isDismissed;
  const source = inAppBrowserSource;

  useEffect(() => {
    if (!isActive) return;

    logAnalyticsEvent(ANALYTICS_EVENT.LANDING_VIEW, {
      platform,
      in_app_browser: isInAppBrowser,
      path: pathname,
      ...(source && { source }),
    });

    const timer = setTimeout(() => {
      const { origin, pathname: currentPathname, search } = window.location;
      const currentPath = `${currentPathname}${search}`;
      const utmSource = new URLSearchParams(search).get('utm_source');

      const escapeUrl = buildInAppBrowserEscapeUrl({
        landingEnv,
        origin,
        currentPath: isSafeInternalPath(currentPath) ? currentPath : '/',
        utmSource: utmSource || null,
      });

      /** 돌아왔을 때 다시 튕기지 않도록 발사 전에 기록 */
      markInAppBrowserEscapeAttempted();

      if (!escapeUrl) {
        setIsDismissed(true);
        return;
      }

      logAnalyticsEvent(ANALYTICS_EVENT.LANDING_APP_OPEN, {
        platform,
        path: pathname,
        ...(source && { source }),
      });
      window.location.href = escapeUrl;
    }, AUTO_LAUNCH_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isActive, landingEnv, platform, isInAppBrowser, pathname, source]);

  /** 이미 웹 위에 있으므로 이동 없이 오버레이만 내린다 */
  const handleWebContinueClick = () => {
    logAnalyticsEvent(ANALYTICS_EVENT.LANDING_WEB_CONTINUE, {
      platform,
      path: pathname,
      ...(source && { source }),
    });
    markInAppBrowserEscapeAttempted();
    setIsDismissed(true);
  };

  if (!isActive) return null;

  return (
    <div
      role="status"
      aria-label="PiKi 앱으로 여는 중"
      className="fixed inset-0"
      style={{ backgroundColor: '#FAFAFA', zIndex: Z_INDEX.IN_APP_BROWSER_ESCAPE }}
    >
      <div
        className="fixed top-1/2 left-1/2"
        style={{ transform: `translate(-50%, -50%) scale(${SPLASH_LOGO_SCALE})` }}
      >
        <PikiLogo
          aria-label="PiKi"
          className="block h-[106px] w-[146px] shrink-0 text-sky-blue-400"
        />
      </div>

      {/* 스킴이 막힌 환경(카톡 업데이트·구버전 인스타)에서 웹으로 남을 길 */}
      <BottomCta className="justify-center bg-transparent pb-10">
        <button
          type="button"
          onClick={handleWebContinueClick}
          className="cursor-pointer px-5 py-3 body-2-medium text-text-neutral-tertiary underline"
        >
          웹으로 계속 보기
        </button>
      </BottomCta>
    </div>
  );
}

export default InAppBrowserEscape;
