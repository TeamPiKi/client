'use client';

import { cn } from '@/utils/cn';

import type { TournamentStatusTabT } from '../_types/tournamentTab';

type Props = {
  activeTab: TournamentStatusTabT;
  onTabChange: (tab: TournamentStatusTabT) => void;
};

const TABS: { value: TournamentStatusTabT; label: string }[] = [
  { value: 'ongoing', label: '진행 중' },
  { value: 'completed', label: '완료' },
];

function TournamentStatusTab({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex w-full gap-0.5">
      {TABS.map(({ value, label }) => {
        const isActive = activeTab === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onTabChange(value)}
            className={cn(
              'flex flex-1 cursor-pointer flex-col items-center gap-3 body-1-semibold transition-colors',
              isActive ? 'text-text-neutral-primary' : 'text-text-neutral-tertiary'
            )}
          >
            {label}
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

export default TournamentStatusTab;
