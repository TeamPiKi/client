'use client';

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

/** 탭 너비/간격/컨테이너 패딩 (px) — 인디케이터 위치 계산에 사용 */
const TAB_WIDTH = 72;
const TAB_GAP = 8;
const BAR_PADDING = 4;
const TAB_STEP = TAB_WIDTH + TAB_GAP;
/** 바 안쪽 전체 너비 (px) — 인디케이터 right 값 계산용 */
const BAR_WIDTH = BAR_PADDING * 2 + TABS.length * TAB_WIDTH + (TABS.length - 1) * TAB_GAP;
/** 이 거리(px) 이상 움직이면 탭이 아니라 드래그로 판정 — 손떨림 탭이 드래그로 빠지지 않을 만큼 */
const DRAG_THRESHOLD = 12;
/** 릴리즈 후 버블이 유리인 채 착지(0.4s + stagger 0.08s)를 마치고 무광 전환·라우팅되기까지 지연 (ms) — 착지 총 시간과 일치 */
const NAVIGATE_DELAY = 480;

/** 스프링 오버슈트 이징 — 리퀴드 글래스 바운스 (짧은 거리 전용, 오버슈트 36%) */
const SPRING_EASE =
  'linear(0, 0.62 3.7%, 1.03 7.2%, 1.28 11%, 1.36 14%, 1.32 20%, 1.14 29%, 1.02 37%, 0.97 44%, 0.99 62%, 1)';

/** 프레스 슬라이드 이징 — 여러 칸을 건너도 목표를 크게 지나치지 않는 약한 스프링 (오버슈트 7%) */
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
  const navigateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lensOffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPressed, setIsPressed] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const activeIndex = TABS.findIndex(({ href }) => matchesTabPath(pathname, href));

  useEffect(
    () => () => {
      if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current);
      if (lensOffTimerRef.current) clearTimeout(lensOffTimerRef.current);
    },
    []
  );

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0 || isGrabbingRef.current) return;
    isDraggedRef.current = false;
    setIsPressed(true);
    // 새 제스처 시작 — 이전 제스처가 예약한 라우팅을 취소해 스테일 타이머·연속 라우팅 방지
    if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current);

    const bar = barRef.current;
    const indicator = indicatorRef.current;
    if (!bar || !indicator || activeIndex < 0) return;

    const pressX = event.clientX - bar.getBoundingClientRect().left;
    const pressIndex = leftToIndex(pressX - TAB_WIDTH / 2);
    const pressLeft = indexToLeft(pressIndex);

    isGrabbingRef.current = true;
    // 프레스 즉시 렌즈로 변신 — 유리인 채 이동하고, 착지 후에 무광으로 돌아옴
    if (lensOffTimerRef.current) clearTimeout(lensOffTimerRef.current);
    setIsGrabbing(true);

    // 착지 애니메이션(NAVIGATE_DELAY) 동안 목적지 라우트를 미리 받아 push 시점 대기를 없앤다
    const pressTabForPrefetch = TABS[pressIndex];
    if (pressTabForPrefetch && pressIndex !== activeIndex) router.prefetch(pressTabForPrefetch.href);

    // 어느 탭을 누르든 버블이 눌린 탭으로 미끄러져 온 뒤 드래그 대상이 됨
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

    const handleMove = (e: PointerEvent) => {
      if (!isDraggedRef.current) {
        if (Math.abs(e.clientX - event.clientX) < DRAG_THRESHOLD) return;
        isDraggedRef.current = true;
        // 이동 애니메이션 중 드래그가 시작되면 현재 렌더 위치에서 이어받아 점프 방지
        anchorLeft = indicator.getBoundingClientRect().left - bar.getBoundingClientRect().left;
        anchorX = e.clientX;
      }

      left = clamp(anchorLeft + (e.clientX - anchorX), BAR_PADDING, indexToLeft(TABS.length - 1));
      indicator.style.transition = 'none';
      indicator.style.left = `${left}px`;
      indicator.style.right = `${BAR_WIDTH - left - TAB_WIDTH}px`;

      // 이동 속도만큼 진행 방향으로 늘어나는 스쿼시 + 끌려가듯 기우는 스큐
      const velocity = clamp(e.clientX - lastX, -10, 10);
      const speed = Math.abs(velocity);
      const bubble = bubbleRef.current;
      if (bubble) {
        bubble.style.transitionDuration = '0.1s';
        bubble.style.transitionTimingFunction = 'ease-out';
        bubble.style.scale = `${1.25 + speed * 0.02} ${1.25 - speed * 0.02}`;
        bubble.style.transform = `skewX(${-velocity * 0.6}deg)`;
      }
      // 반사광은 이동 반대편으로 밀리며 잔상처럼 따라옴
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
      // 렌즈는 유리인 채 착지를 마친 뒤에 무광으로 전환
      lensOffTimerRef.current = setTimeout(() => setIsGrabbing(false), NAVIGATE_DELAY);

      const bubble = bubbleRef.current;
      if (bubble) {
        bubble.style.scale = '';
        bubble.style.transform = '';
        bubble.style.transitionDuration = '';
        bubble.style.transitionTimingFunction = '';
      }
      const glint = glintRef.current;
      if (glint) glint.style.translate = '';

      // 시스템이 제스처를 중단(pointercancel)하면 스냅·라우팅 없이 인디케이터를 활성 탭으로 복원
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
        // 탭: 버블은 이미 눌린 탭으로 이동 중 — 내비게이션은 여기서 처리하고 Link 클릭은 차단
        const pressTab = TABS[pressIndex];
        if (pressTab && pressIndex !== activeIndex) {
          isDraggedRef.current = true;
          navigateTimerRef.current = setTimeout(() => router.push(pressTab.href), NAVIGATE_DELAY);
        }
        return;
      }

      // 가까운 탭으로 스냅 — 진행 방향 가장자리가 먼저 늘어나는 액체 스프링
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
        // 스냅 애니메이션 동안 목적지 라우트를 미리 받아 push 시점 대기를 없앤다
        router.prefetch(targetTab.href);
        navigateTimerRef.current = setTimeout(() => router.push(targetTab.href), NAVIGATE_DELAY);
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
          // 드래그·탭 제스처의 내비게이션은 릴리즈에서 처리하므로 Link 클릭은 차단 (제스처당 1회)
          if (!isDraggedRef.current) return;
          isDraggedRef.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
        className={cn(
          'relative isolate inline-flex h-[58px] touch-none items-center gap-2 rounded-full p-1 shadow-[0px_6px_24px_0px_rgba(0,0,0,0.16)] transition-transform duration-200 ease-out select-none',
          isPressed && 'scale-102'
        )}
      >
        {/* 유리 레이어: 블러 + 채도 */}
        <div className="absolute inset-0 -z-30 rounded-full backdrop-blur-[3px] backdrop-saturate-120" />
        {/* 틴트 레이어 — 평소엔 반투명 흰색, 렌즈 상태(홀드/드래그)에서만 더 투명해져 유리가 드러남 */}
        <div
          className={cn(
            'absolute inset-0 -z-20 rounded-full transition-colors duration-200 ease-out',
            isGrabbing ? 'bg-white/40' : 'bg-white/80'
          )}
        />
        {/* 반사광 레이어 */}
        <div className="absolute inset-0 -z-10 rounded-full shadow-[inset_2px_2px_1px_0_rgba(255,255,255,0.6),inset_-1px_-1px_1px_1px_rgba(255,255,255,0.4)]" />
        {/* 활성 탭 인디케이터 — 꾹 잡고 드래그해 다른 탭으로 옮길 수 있는 버블 */}
        {activeIndex >= 0 && (
          <div
            ref={indicatorRef}
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-1 bottom-1',
              // 잡는 동안엔 아이콘 위로 올라와 렌즈로 동작
              isGrabbing ? 'z-10' : '-z-10'
            )}
            style={{
              left: indexToLeft(activeIndex),
              right: BAR_WIDTH - indexToLeft(activeIndex) - TAB_WIDTH,
            }}
          >
            {/* 누르면 부풀고 드래그 속도에 따라 진행 방향으로 늘어나는 스쿼시 */}
            <div
              ref={bubbleRef}
              className={cn(
                'relative size-full overflow-hidden rounded-full transition-[scale,transform,background-color,box-shadow,backdrop-filter] duration-300',
                // 평소엔 무광 알약, 잡는 동안만 유리 렌즈로 전환
                isGrabbing
                  ? 'scale-125 bg-white/2 shadow-[inset_1.5px_1.5px_1px_0_rgba(255,255,255,0.6),inset_-1px_-1px_1px_0_rgba(255,255,255,0.35),0_4px_12px_0_rgba(0,0,0,0.18)]'
                  : 'bg-black/8'
              )}
              style={{ transitionTimingFunction: SPRING_EASE }}
            >
              {/* 이동 시 반대편으로 밀리는 반사광 */}
              <div
                ref={glintRef}
                className={cn(
                  'absolute inset-0 rounded-full transition-[translate,opacity] duration-200 ease-out',
                  isGrabbing ? 'opacity-100' : 'opacity-0'
                )}
                style={{
                  // 위쪽 테두리에만 붙는 얇은 반사광 — 중앙은 침범하지 않음
                  background:
                    'radial-gradient(75% 45% at 40% -12%, rgba(255,255,255,0.55), transparent 55%)',
                }}
              />
            </div>
          </div>
        )}
        {TABS.map(({ label, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon, href }) => {
          const isActive = matchesTabPath(pathname, href);
          const Icon = isActive ? ActiveIcon : InactiveIcon;
          return (
            <Link
              key={label}
              href={href}
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
