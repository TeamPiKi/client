'use client';

import { cn } from '@/utils/cn';

import type { UnderlineTabItemT } from './underlineTab.types';

type UnderlineTabProps<T extends string> = {
  tabs: readonly UnderlineTabItemT<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  idPrefix?: string;
  panelId?: string;
};

function UnderlineTab<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  idPrefix,
  panelId,
}: UnderlineTabProps<T>) {
  return (
    <div role="tablist" className="flex w-full">
      {tabs.map(({ value, label }) => {
        const isActive = activeTab === value;
        return (
          <button
            key={value}
            id={idPrefix && `${idPrefix}-${value}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            onClick={() => onTabChange(value)}
            className={cn(
              'flex flex-1 cursor-pointer flex-col items-center gap-[7px] pt-[9px] body-1-semibold transition-colors',
              isActive ? 'text-text-neutral-primary' : 'text-text-neutral-tertiary'
            )}
          >
            {label}
            <span
              className={cn('h-0.5 w-full', isActive && 'bg-gray-900')}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}

export default UnderlineTab;
