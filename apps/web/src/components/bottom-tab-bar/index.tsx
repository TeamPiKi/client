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
/** 이 거리(px) 이상 움직이면 탭이 아니라 드래그로 판정 */
const DRAG_THRESHOLD = 6;
/** 드래그 릴리즈 후 스냅 애니메이션이 자리잡은 뒤 라우팅하기까지 지연 (ms) */
const NAVIGATE_DELAY = 280;

/** 스프링 오버슈트 이징 — 리퀴드 글래스 바운스 */
const SPRING_EASE =
  'linear(0, 0.62 3.7%, 1.03 7.2%, 1.28 11%, 1.36 14%, 1.32 20%, 1.14 29%, 1.02 37%, 0.97 44%, 0.99 62%, 1)';

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
  const isDraggedRef = useRef(false);
  const isGrabbingRef = useRef(false);
  const navigateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPressed, setIsPressed] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const activeIndex = TABS.findIndex(({ href }) => matchesTabPath(pathname, href));

  useEffect(
    () => () => {
      if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current);
    },
    []
  );

  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0 || isGrabbingRef.current) return;
    isDraggedRef.current = false;
    setIsPressed(true);

    const bar = barRef.current;
    const indicator = indicatorRef.current;
    if (!bar || !indicator || activeIndex < 0) return;

    const startLeft = indexToLeft(activeIndex);
    const pressX = event.clientX - bar.getBoundingClientRect().left;
    // 활성 탭(버블) 위에서 시작한 프레스만 드래그 대상 — 다른 탭 프레스는 Link 탭으로 처리
    if (pressX < startLeft || pressX > startLeft + TAB_WIDTH) return;

    isGrabbingRef.current = true;
    setIsGrabbing(true);

    const startX = event.clientX;
    let left = startLeft;
    let lastX = event.clientX;

    const handleMove = (e: PointerEvent) => {
      const totalDx = e.clientX - startX;
      if (!isDraggedRef.current && Math.abs(totalDx) < DRAG_THRESHOLD) return;
      isDraggedRef.current = true;

      left = clamp(startLeft + totalDx, BAR_PADDING, indexToLeft(TABS.length - 1));
      indicator.style.transition = 'none';
      indicator.style.left = `${left}px`;
      indicator.style.right = `${BAR_WIDTH - left - TAB_WIDTH}px`;

      // 이동 속도만큼 진행 방향으로 늘어나는 스쿼시
      const bubble = bubbleRef.current;
      if (bubble) {
        const delta = Math.min(Math.abs(e.clientX - lastX), 10);
        bubble.style.transitionDuration = '0.1s';
        bubble.style.transitionTimingFunction = 'ease-out';
        bubble.style.scale = `${1.25 + delta * 0.02} ${1.25 - delta * 0.02}`;
      }
      lastX = e.clientX;
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      isGrabbingRef.current = false;
      setIsGrabbing(false);
      setIsPressed(false);

      const bubble = bubbleRef.current;
      if (bubble) {
        bubble.style.scale = '';
        bubble.style.transitionDuration = '';
        bubble.style.transitionTimingFunction = '';
      }

      if (!isDraggedRef.current) return;

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
        navigateTimerRef.current = setTimeout(() => router.push(targetTab.href), NAVIGATE_DELAY);
      }
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
  };

  return (
    <div
      ref={barRef}
      data-bottom-tab-bar // NOTE: 탭바가 렌더된 페이지에서 토스트가 탭바 위에 뜨도록 하는 마커
      onPointerDown={handlePointerDown}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => !isGrabbingRef.current && setIsPressed(false)}
      onPointerCancel={() => !isGrabbingRef.current && setIsPressed(false)}
      onClickCapture={e => {
        // 드래그로 끝난 제스처의 클릭은 Link 내비게이션으로 이어지지 않도록 차단
        if (!isDraggedRef.current) return;
        e.preventDefault();
        e.stopPropagation();
      }}
      className={cn(
        'relative isolate inline-flex h-[58px] touch-none items-center gap-2 rounded-full bg-white/80 p-1 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] backdrop-blur-md transition-transform duration-200 ease-out select-none',
        isPressed && 'scale-102'
      )}
    >
      {/* 활성 탭 인디케이터 — 꾹 잡고 드래그해 다른 탭으로 옮길 수 있는 버블 */}
      {activeIndex >= 0 && (
        <div
          ref={indicatorRef}
          aria-hidden
          className="absolute top-1 bottom-1 -z-10"
          style={{
            left: indexToLeft(activeIndex),
            right: BAR_WIDTH - indexToLeft(activeIndex) - TAB_WIDTH,
          }}
        >
          {/* 누르면 부풀고 드래그 속도에 따라 진행 방향으로 늘어나는 스쿼시 */}
          <div
            ref={bubbleRef}
            className={cn(
              'size-full rounded-full bg-black/8 transition-transform duration-300',
              isGrabbing && 'scale-125'
            )}
            style={{ transitionTimingFunction: SPRING_EASE }}
          />
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
  );
}

export default BottomTabBar;
