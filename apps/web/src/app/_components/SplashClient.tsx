'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import PikiLogo from '@/assets/images/piki-logo-cart.svg';
import { ROUTES } from '@/consts/route';

import './splash.css';

type LogoTransformT = {
  top: number | string;
  transition: string;
};

type SplashClientProps = {
  showAppleLogin: boolean;
};

const SPLASH_HOLD_MS = 400;
const SPLASH_FADE_IN_MS = 1500;
const SPLASH_MOVE_MS = 700;

const MOVE_TRANSITION = `top ${SPLASH_MOVE_MS}ms ease-in-out`;

function SplashClient({ showAppleLogin }: SplashClientProps) {
  const router = useRouter();
  const targetRef = useRef<HTMLDivElement>(null);
  const hasNavigatedRef = useRef(false);
  const moveTimeoutRef = useRef(0);
  const [isBackgroundShifted, setIsBackgroundShifted] = useState(false);
  const [logoTransform, setLogoTransform] = useState<LogoTransformT>({
    top: '50%',
    transition: 'none',
  });

  const navigateToNext = useCallback(() => {
    if (hasNavigatedRef.current) return;

    hasNavigatedRef.current = true;
    router.replace(ROUTES.LOGIN);
  }, [router]);

  useEffect(() => {
    router.prefetch(ROUTES.LOGIN);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      navigateToNext();
      return;
    }

    const startMove = () => {
      const targetElement = targetRef.current;
      if (!targetElement) {
        navigateToNext();
        return;
      }

      const targetRect = targetElement.getBoundingClientRect();

      /** 이동 시작 전 현재 위치에 스냅 — transition 재적용 시 점프 방지 */
      setLogoTransform({ top: '50%', transition: 'none' });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsBackgroundShifted(true);
          setLogoTransform({
            top: targetRect.top + targetRect.height / 2,
            transition: MOVE_TRANSITION,
          });
          moveTimeoutRef.current = window.setTimeout(navigateToNext, SPLASH_MOVE_MS);
        });
      });
    };

    let holdTimeoutId = 0;

    /** 이동 애니메이션은 로그인 페이지의 로고 자리로 착지시켜 화면을 이어붙이는 연출이다 */
    const fadeInTimeoutId = window.setTimeout(() => {
      holdTimeoutId = window.setTimeout(startMove, SPLASH_HOLD_MS);
    }, SPLASH_FADE_IN_MS);

    return () => {
      window.clearTimeout(fadeInTimeoutId);
      if (holdTimeoutId) window.clearTimeout(holdTimeoutId);
      if (moveTimeoutRef.current) window.clearTimeout(moveTimeoutRef.current);
    };
  }, [navigateToNext, router]);

  return (
    <main
      className="relative overflow-hidden"
      /** FOUC 방지하기 위해 인라인 스타일로 적용 */
      style={{ height: '100dvh', width: '100%', backgroundColor: '#FAFAFA' }}
    >
      {/** 착지 시점에 로그인 배경과 이어지도록 같은 그라데이션을 덧입힌다 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-bg-layer-default to-bg-layer-basement transition-opacity duration-700 ease-in-out"
        style={{ opacity: isBackgroundShifted ? 1 : 0 }}
      />

      {/**
       * 로그인 페이지와 동일한 레이아웃 앵커. 보이지 않지만 로고가 이동할 최종 좌표를 측정한다.
       * 세로 가운데 정렬이라 콘텐츠 블록 전체 높이가 좌표를 결정한다 — 로그인 화면을 고치면 여기도 같이 고쳐야 한다.
       */}
      <div
        aria-hidden
        /** 낮은 화면에서 로그인처럼 콘텐츠만큼 늘어나야 착지 좌표가 어긋나지 않는다 (inset-0 은 뷰포트에 고정됨) */
        className="pointer-events-none invisible absolute inset-x-0 top-0 flex min-h-full flex-col items-center justify-center px-5 pt-padding-top pb-10"
      >
        <div className="flex w-full flex-col items-center">
          <div ref={targetRef} className="h-[86px] w-[117px] shrink-0" />

          <p className="mt-7 text-center heading-1-bold">
            매일 쌓여만 가던
            <br />
            위시리스트가 오늘의 결정으로
          </p>

          <div className="mt-[110px] w-full">
            <div className="flex w-full flex-col items-center gap-4">
              <div className="h-[54px] w-full" />
              {showAppleLogin && <div className="h-[54px] w-full" />}
              <div className="h-[54px] w-full" />
            </div>

            <p className="mt-[26px] text-center caption-1-semibold">
              가입 시 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>

      <div
        className="splash-logo fixed left-1/2 z-10"
        style={{
          top: logoTransform.top,
          transform: 'translate(-50%, -50%)',
          transition: logoTransform.transition,
        }}
      >
        <PikiLogo
          aria-label="PiKi"
          className="block h-[86px] w-[117px] shrink-0 text-sky-blue-400"
        />
      </div>
    </main>
  );
}

export default SplashClient;
