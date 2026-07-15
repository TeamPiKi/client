'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import HeartIconFill from '@/assets/icons/fill/heart.svg';
import HomeIconFill from '@/assets/icons/fill/home.svg';
import { ROUTES } from '@/consts/route';

const TABS = [
  { label: '홈', icon: HomeIconFill, href: ROUTES.HOME },
  { label: '보관', icon: HeartIconFill, href: ROUTES.WISHLIST },
] as const;

function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <>
      {isClient &&
        createPortal(
          <div
            className="pointer-events-none fixed bottom-0 left-1/2 z-10 h-[240px] w-full max-w-120 -translate-x-1/2"
            style={{
              background:
                'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.20) 100%)',
            }}
          />,
          document.body
        )}
      <div
        // 탭바가 렌더된 페이지에서 토스트가 탭바 위에 뜨도록 하는 마커 (globals.css 참고)
        data-bottom-tab-bar
        className="inline-flex items-center rounded-[100px] bg-white p-1 shadow-[0_0_8px_0_rgba(0,0,0,0.04)]"
      >
        {TABS.map(({ label, icon: Icon, href }) => {
          const isActive =
            label === '보관'
              ? pathname.startsWith(ROUTES.WISHLIST) ||
                pathname.startsWith(ROUTES.TOURNAMENT_HISTORY)
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <button
              key={label}
              type="button"
              onClick={() => router.push(href)}
              className={`flex w-[100px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[100px] py-[9px] transition-colors ${
                isActive ? 'bg-gray-50 text-gray-600' : 'text-gray-300'
              }`}
            >
              <Icon width={24} height={24} />
              <span
                className="text-[11px] leading-[127.3%] font-medium tracking-[0.342px]"
                style={{ fontFeatureSettings: "'ss10' on" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default BottomTabBar;
