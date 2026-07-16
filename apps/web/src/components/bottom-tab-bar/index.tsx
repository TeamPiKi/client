'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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

const matchesTabPath = (pathname: string, basePath: string) =>
  pathname === basePath || pathname.startsWith(`${basePath}/`);

function BottomTabBar() {
  const pathname = usePathname();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      data-bottom-tab-bar // NOTE: 탭바가 렌더된 페이지에서 토스트가 탭바 위에 뜨도록 하는 마커
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      onPointerCancel={() => setIsPressed(false)}
      className={cn(
        'inline-flex h-[58px] items-center gap-2 rounded-full bg-white/80 p-1 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)] backdrop-blur-md transition-transform duration-200 ease-out',
        isPressed && 'scale-102'
      )}
    >
      {TABS.map(({ label, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon, href }) => {
        const isActive = matchesTabPath(pathname, href);
        const Icon = isActive ? ActiveIcon : InactiveIcon;
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              'flex h-full w-[72px] cursor-pointer flex-col items-center justify-center rounded-full p-2 transition-colors',
              isActive ? 'bg-black/8 text-gray-900' : 'text-gray-800'
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
