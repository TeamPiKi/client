'use client';

import { useSearchParams } from 'next/navigation';
import type { ComponentType, SVGProps } from 'react';

import { FolderIconOutline, HeartIconOutline } from '@/assets/icons';
import { ROUTES } from '@/consts/route';
import { cn } from '@/utils/cn';
import { replaceUrlKeepingState } from '@/utils/replaceUrlKeepingState';

import { WISH_TAB } from '../_consts/wishTab';
import type { WishTabT } from '../_types/wishTab';
import { parseWishTabParam } from '../_utils/wishSearchParams';

const TABS: {
  value: WishTabT;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  path: string;
}[] = [
  { value: WISH_TAB.ALL, label: '전체 위시', Icon: HeartIconOutline, path: ROUTES.WISH },
  {
    value: WISH_TAB.FOLDER,
    label: '폴더',
    Icon: FolderIconOutline,
    path: ROUTES.WISHLIST_FOLDER_TAB,
  },
];

function WishTabBar() {
  const searchParams = useSearchParams();
  const activeTab = parseWishTabParam(searchParams.get('tab'));

  return (
    <div role="tablist" className="flex w-full gap-0.5">
      {TABS.map(({ value, label, Icon, path }) => {
        const isActive = activeTab === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => !isActive && replaceUrlKeepingState(path)}
            className={cn(
              'flex flex-1 cursor-pointer flex-col items-center gap-3 body-1-semibold transition-colors',
              isActive ? 'text-text-neutral-primary' : 'text-text-neutral-tertiary'
            )}
          >
            <span className="flex items-center gap-1">
              <Icon className="size-5" />
              {label}
            </span>
            <span
              className={cn('h-0.5 w-full rounded-full', isActive && 'bg-gray-700')}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}

export default WishTabBar;
