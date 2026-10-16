'use client';

import { HAPTIC_STYLE } from '@piki/core';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  HeartIconFill,
  HeartIconOutline,
  HomeIconFill,
  HomeIconOutline,
  PersonIconFill,
  PersonIconOutline,
  TrophyIconFill,
  TrophyIconOutline,
} from '@/assets/icons';
import { ROUTES } from '@/consts/route';
import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';
import { triggerHaptic } from '@/utils/haptic';

const TABS = [
  { label: '홈', activeIcon: HomeIconFill, inactiveIcon: HomeIconOutline, href: ROUTES.HOME },
  {
    label: '위시',
    activeIcon: HeartIconFill,
    inactiveIcon: HeartIconOutline,
    href: ROUTES.WISHLIST,
  },
  {
    label: '토너먼트',
    activeIcon: TrophyIconFill,
    inactiveIcon: TrophyIconOutline,
    href: ROUTES.TOURNAMENT_HISTORY,
  },
  {
    label: '마이',
    activeIcon: PersonIconFill,
    inactiveIcon: PersonIconOutline,
    href: ROUTES.MYPAGE,
  },
] as const;

const TAB_WIDTH = 72;
const TAB_GAP = 8;
const BAR_PADDING = 4;
const TAB_STEP = TAB_WIDTH + TAB_GAP;
const BAR_WIDTH = BAR_PADDING * 2 + TABS.length * TAB_WIDTH + (TABS.length - 1) * TAB_GAP;
/** 이 거리(px) 이상 움직여야 드래그로 판정 — 손떨림 방지 */
const DRAG_THRESHOLD = 12;
/** 버블 착지가 끝난 뒤 렌즈를 끄기까지의 시간 (ms) */
const LANDING_MS = 480;

/** 스냅용 스프링 이징 — 짧은 거리 전용 (오버슈트 36%) */
const SPRING_EASE =
  'linear(0, 0.62 3.7%, 1.03 7.2%, 1.28 11%, 1.36 14%, 1.32 20%, 1.14 29%, 1.02 37%, 0.97 44%, 0.99 62%, 1)';

/** 프레스 슬라이드 이징 — 여러 칸을 건너도 크게 지나치지 않게 */
const SLIDE_EASE =
  'linear(0, 0.5 7.6%, 0.84 15%, 1.04 24%, 1.07 32%, 1.05 40%, 1.01 54%, 0.99 68%, 1)';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const matchesTabPath = (pathname: string, basePath: string) =>
  pathname === basePath || pathname.startsWith(`${basePath}/`);

const indexToLeft = (index: number) => BAR_PADDING + index * TAB_STEP;

const leftToIndex = (left: number) =>
  clamp(Math.round((left - BAR_PADDING) / TAB_STEP), 0, TABS.length - 1);

function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const barRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);
  const isDraggedRef = useRef(false);
  const isGrabbingRef = useRef(false);
  const lensOffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPressed, setIsPressed] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const isWishFolderRoute = /^\/wish(?:\/folder\/\d+)?$/.test(pathname); // TODO: /wish/folder/:folderId 만 해당되도록 조건 변경 필요. 현재는 /wish, /wish/folder/:folderId 둘 다 해당. 변수명은 이관 이후 기준으로 작성
  const activeIndex = TABS.findIndex(
    ({ href }) => matchesTabPath(pathname, href) || (isWishFolderRoute && href === ROUTES.WISHLIST)
  );

  useEffect(
    () => () => {
      if (lensOffTimerRef.current) clearTimeout(lensOffTimerRef.current);
    },
    []
  );

  // 탭 경로와 정확히 일치할 때만 노출 — 하위 상세/편집 라우트에서는 숨김
  if (!isWishFolderRoute && !TABS.some(({ href }) => href === pathname)) return null;

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0 || isGrabbingRef.current) return;
    isDraggedRef.current = false;
    setIsPressed(true);
    triggerHaptic(HAPTIC_STYLE.LIGHT);

    const bar = barRef.current;
    const indicator = indicatorRef.current;
    if (!bar || !indicator || activeIndex < 0) return;

    const pressX = event.clientX - bar.getBoundingClientRect().left;
    const pressIndex = leftToIndex(pressX - TAB_WIDTH / 2);
    const pressLeft = indexToLeft(pressIndex);

    isGrabbingRef.current = true;
    if (lensOffTimerRef.current) clearTimeout(lensOffTimerRef.current);
    setIsGrabbing(true);

    // 마운트 시 prefetch 가 만료(30s)된 뒤 눌린 경우 대비
    const pressTabForPrefetch = TABS[pressIndex];
    if (pressTabForPrefetch && pressIndex !== activeIndex)
      router.prefetch(pressTabForPrefetch.href);

    const isMovingToRight = pressLeft >= indexToLeft(activeIndex);
    indicator.style.transitionProperty = 'left, right';
    indicator.style.transitionDuration = '0.4s, 0.4s';
    indicator.style.transitionTimingFunction = `${SLIDE_EASE}, ${SLIDE_EASE}`;
    indicator.style.transitionDelay = isMovingToRight ? '0.08s, 0s' : '0s, 0.08s';
    indicator.style.left = `${pressLeft}px`;
    indicator.style.right = `${BAR_WIDTH - pressLeft - TAB_WIDTH}px`;

    let left = pressLeft;
    let anchorLeft = pressLeft;
    let anchorX = event.clientX;
    let lastX = event.clientX;
    let hoverIndex = pressIndex;

    const handleMove = (e: PointerEvent) => {
      if (!isDraggedRef.current) {
        if (Math.abs(e.clientX - event.clientX) < DRAG_THRESHOLD) return;
        isDraggedRef.current = true;
        // 슬라이드 도중 드래그가 시작되면 현재 렌더 위치에서 이어받아 점프 방지
        anchorLeft = indicator.getBoundingClientRect().left - bar.getBoundingClientRect().left;
        anchorX = e.clientX;
      }

      left = clamp(anchorLeft + (e.clientX - anchorX), BAR_PADDING, indexToLeft(TABS.length - 1));
      indicator.style.transition = 'none';
      indicator.style.left = `${left}px`;
      indicator.style.right = `${BAR_WIDTH - left - TAB_WIDTH}px`;

      const nextHoverIndex = leftToIndex(left);
      if (nextHoverIndex !== hoverIndex) {
        hoverIndex = nextHoverIndex;
        triggerHaptic(HAPTIC_STYLE.SELECTION);
      }

      const velocity = clamp(e.clientX - lastX, -10, 10);
      const speed = Math.abs(velocity);
      const bubble = bubbleRef.current;
      if (bubble) {
        bubble.style.transitionDuration = '0.1s';
        bubble.style.transitionTimingFunction = 'ease-out';
        bubble.style.scale = `${1.25 + speed * 0.02} ${1.25 - speed * 0.02}`;
        bubble.style.transform = `skewX(${-velocity * 0.6}deg)`;
      }
      const glint = glintRef.current;
      if (glint) glint.style.translate = `${-velocity * 1.6}px 0`;
      lastX = e.clientX;
    };

    const handleUp = (releaseEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      isGrabbingRef.current = false;
      setIsPressed(false);
      lensOffTimerRef.current = setTimeout(() => setIsGrabbing(false), LANDING_MS);

      const bubble = bubbleRef.current;
      if (bubble) {
        bubble.style.scale = '';
        bubble.style.transform = '';
        bubble.style.transitionDuration = '';
        bubble.style.transitionTimingFunction = '';
      }
      const glint = glintRef.current;
      if (glint) glint.style.translate = '';

      // pointercancel: 스냅·라우팅 없이 활성 탭으로 복원
      if (releaseEvent.type === 'pointercancel') {
        isDraggedRef.current = false;
        const activeLeft = indexToLeft(activeIndex);
        indicator.style.transitionProperty = 'left, right';
        indicator.style.transitionDuration = '0.4s, 0.4s';
        indicator.style.transitionTimingFunction = `${SPRING_EASE}, ${SPRING_EASE}`;
        indicator.style.transitionDelay = '0s, 0s';
        indicator.style.left = `${activeLeft}px`;
        indicator.style.right = `${BAR_WIDTH - activeLeft - TAB_WIDTH}px`;
        return;
      }

      if (!isDraggedRef.current) {
        // 단순 탭 — Link 클릭은 onClickCapture 에서 막고 여기서 라우팅
        const pressTab = TABS[pressIndex];
        if (pressTab && pressIndex !== activeIndex) {
          isDraggedRef.current = true;
          router.push(pressTab.href);
        }
        return;
      }

      const targetIndex = leftToIndex(left);
      const targetLeft = indexToLeft(targetIndex);
      const isSnapRight = targetLeft >= left;
      indicator.style.transitionProperty = 'left, right';
      indicator.style.transitionDuration = '0.4s, 0.4s';
      indicator.style.transitionTimingFunction = `${SPRING_EASE}, ${SPRING_EASE}`;
      indicator.style.transitionDelay = isSnapRight ? '0.08s, 0s' : '0s, 0.08s';
      indicator.style.left = `${targetLeft}px`;
      indicator.style.right = `${BAR_WIDTH - targetLeft - TAB_WIDTH}px`;

      const targetTab = TABS[targetIndex];
      if (targetTab && targetIndex !== activeIndex) {
        // 활성 탭에서 시작한 드래그는 프레스 prefetch 를 건너뛰므로 여기서 보충
        router.prefetch(targetTab.href);
        router.push(targetTab.href);
      }
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
  };

  return (
    <div
      data-bottom-tab-bar // NOTE: 탭바가 렌더된 페이지에서 토스트가 탭바 위에 뜨도록 하는 마커
      className="fixed bottom-8 left-1/2 -translate-x-1/2"
      style={{ zIndex: Z_INDEX.BOTTOM_TAB_BAR }}
    >
      <div
        ref={barRef}
        onPointerDown={handlePointerDown}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => !isGrabbingRef.current && setIsPressed(false)}
        onPointerCancel={() => !isGrabbingRef.current && setIsPressed(false)}
        onClickCapture={e => {
          // 제스처 내비게이션은 pointerup 에서 처리하므로 Link 클릭은 차단
          if (!isDraggedRef.current) return;
          isDraggedRef.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
        className={cn(
          'liquid-glass inline-flex h-[58px] touch-none items-center gap-2 rounded-full p-1 shadow-[0px_6px_24px_0px_rgba(0,0,0,0.16)] transition-transform duration-200 ease-out select-none',
          isGrabbing && 'liquid-glass-active',
          isPressed && 'scale-102'
        )}
      >
        {/* 활성 탭 인디케이터 — 드래그로 옮길 수 있는 버블 */}
        {activeIndex >= 0 && (
          <div
            ref={indicatorRef}
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-1 bottom-1',
              isGrabbing ? 'z-10' : '-z-10'
            )}
            style={{
              left: indexToLeft(activeIndex),
              right: BAR_WIDTH - indexToLeft(activeIndex) - TAB_WIDTH,
            }}
          >
            <div
              ref={bubbleRef}
              className={cn(
                'relative size-full overflow-hidden rounded-full transition-[scale,transform,background-color,box-shadow,backdrop-filter] duration-300',
                isGrabbing ? 'scale-125 liquid-glass-lens' : 'bg-black/8'
              )}
              style={{ transitionTimingFunction: SPRING_EASE }}
            >
              <div
                ref={glintRef}
                className={cn(
                  'absolute inset-0 rounded-full transition-[translate,opacity] duration-200 ease-out liquid-glass-glint',
                  isGrabbing ? 'opacity-100' : 'opacity-0'
                )}
              />
            </div>
          </div>
        )}
        {TABS.map(({ label, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon, href }, index) => {
          const isActive = index === activeIndex;
          const Icon = isActive ? ActiveIcon : InactiveIcon;
          const linkHref = isWishFolderRoute && href === ROUTES.WISHLIST ? ROUTES.WISH : href; // TEMP
          return (
            <Link
              key={label}
              href={linkHref}
              prefetch={!isActive}
              draggable={false}
              className={cn(
                'flex h-full w-[72px] cursor-pointer flex-col items-center justify-center rounded-full p-2 transition-colors',
                isActive ? 'text-gray-900' : 'text-gray-800'
              )}
            >
              <Icon className="size-5.5 shrink-0" />
              <span
                className="text-[10px] leading-[18px] font-medium tracking-[-0.4px]"
                style={{ fontFeatureSettings: "'ss10' on" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default BottomTabBar;
