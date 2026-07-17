'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import PikiLogo from '@/assets/images/piki-logo-cart.svg';
import { ROUTES } from '@/consts/route';

import './splash.css';

type LogoTransformT = {
  top: number | string;
  scale: number;
  transition: string;
};

/** 로그인 페이지 PikiLogo 원본 너비(px) */
const LOGIN_LOGO_WIDTH = 146;
/** 스플래시에서 보여줄 로고 너비(px) */
const SPLASH_LOGO_WIDTH = 200;
/**
 * SVG width attribute로 키우면 viewBox만 커지고 path는 그대로라 왼쪽 위로 치우쳐 보임.
 * 원본 크기(146px)로 렌더한 뒤 transform scale로 통째로 확대한다.
 */
const SPLASH_SCALE = SPLASH_LOGO_WIDTH / LOGIN_LOGO_WIDTH;

const SPLASH_HOLD_MS = 400;
const SPLASH_FADE_IN_MS = 1500;
const SPLASH_SHRINK_MS = 700;

const SHRINK_TRANSITION = `top ${SPLASH_SHRINK_MS}ms ease-in-out, transform ${SPLASH_SHRINK_MS}ms ease-in-out`;

function SplashClient() {
  const router = useRouter();
  const targetRef = useRef<HTMLDivElement>(null);
  const hasNavigatedRef = useRef(false);
  const shrinkTimeoutRef = useRef(0);
  const [isBackgroundShifted, setIsBackgroundShifted] = useState(false);
  const [logoTransform, setLogoTransform] = useState<LogoTransformT>({
    top: '50%',
    scale: SPLASH_SCALE,
    transition: 'none',
  });

  const navigateToLogin = useCallback(() => {
    if (hasNavigatedRef.current) return;

    hasNavigatedRef.current = true;
    router.replace(ROUTES.LOGIN);
  }, [router]);

  useEffect(() => {
    router.prefetch(ROUTES.LOGIN);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      navigateToLogin();
      return;
    }

    const startShrink = () => {
      const targetElement = targetRef.current;
      if (!targetElement) {
        navigateToLogin();
        return;
      }

      const targetRect = targetElement.getBoundingClientRect();

      /** 축소 시작 전 현재 위치에 스냅 — transition 재적용 시 점프 방지 */
      setLogoTransform({
        top: '50%',
        scale: SPLASH_SCALE,
        transition: 'none',
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsBackgroundShifted(true);
          setLogoTransform({
            top: targetRect.top + targetRect.height / 2,
            scale: 1,
            transition: SHRINK_TRANSITION,
          });
          shrinkTimeoutRef.current = window.setTimeout(navigateToLogin, SPLASH_SHRINK_MS);
        });
      });
    };

    let holdTimeoutId = 0;

    const fadeInTimeoutId = window.setTimeout(() => {
      holdTimeoutId = window.setTimeout(startShrink, SPLASH_HOLD_MS);
    }, SPLASH_FADE_IN_MS);

    return () => {
      window.clearTimeout(fadeInTimeoutId);
      if (holdTimeoutId) window.clearTimeout(holdTimeoutId);
      if (shrinkTimeoutRef.current) window.clearTimeout(shrinkTimeoutRef.current);
    };
  }, [navigateToLogin, router]);

  return (
    <main
      className="relative"
      /** FOUC 방지하기 위해 인라인 스타일로 적용 */
      style={{
        height: '100dvh',
        width: '100%',
        backgroundColor: isBackgroundShifted ? 'var(--color-gray-50)' : '#A2DEFF',
        transition: isBackgroundShifted ? 'background-color 0.7s ease-in-out' : 'none',
      }}
    >
      {/**
       * 로그인 페이지와 동일한 레이아웃 앵커. 보이지 않지만 로고가 이동할 최종 좌표를 측정한다.
       */}
      <div
        aria-hidden
        className="pointer-events-none invisible absolute inset-0 flex flex-col items-center px-4 pt-padding-top"
      >
        <div className="mt-15 flex flex-col items-center">
          <div ref={targetRef} className="h-[106px] w-[146px] shrink-0" />
        </div>
      </div>

      <div
        className="splash-logo fixed left-1/2 z-10"
        style={{
          top: logoTransform.top,
          transform: `translate(-50%, -50%) scale(${logoTransform.scale})`,
          transition: logoTransform.transition,
        }}
      >
        <PikiLogo
          aria-label="PiKi"
          className="block h-[106px] w-[146px] shrink-0 text-text-neutral-primary"
        />
      </div>
    </main>
  );
}

export default SplashClient;
