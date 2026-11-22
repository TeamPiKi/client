'use client';

import type { KeyboardEvent } from 'react';

import { cn } from '@/utils/cn';

import type { UnderlineTabItemT } from './underlineTab.types';

export type { UnderlineTabItemT } from './underlineTab.types';

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
  /** 좌우 방향키는 포커스만 옮기고, 선택은 Enter·Space(버튼 클릭)로 바꾼다 */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    const tabElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    );
    const currentIndex = tabElements.indexOf(event.target as HTMLButtonElement);
    if (currentIndex === -1) return;

    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    tabElements[(currentIndex + offset + tabElements.length) % tabElements.length]?.focus();
  };

  return (
    <div role="tablist" className="flex w-full" onKeyDown={handleKeyDown}>
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
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(value)}
            className={cn(
              'flex flex-1 cursor-pointer flex-col items-center gap-[7px] pt-[9px] body-1-semibold transition-colors',
              isActive ? 'text-text-neutral-primary' : 'text-text-neutral-tertiary'
            )}
          >
            {label}
            <span className={cn('h-0.5 w-full', isActive && 'bg-gray-900')} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}

export default UnderlineTab;
