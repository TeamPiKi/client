'use client';

import { cn } from '@/utils/cn';

export type TournamentStatusTabT = 'in-progress' | 'completed';

type Props = {
  activeTab: TournamentStatusTabT;
  onTabChange: (tab: TournamentStatusTabT) => void;
};

const TABS: { value: TournamentStatusTabT; label: string }[] = [
  { value: 'in-progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
];

function TournamentStatusTab({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex w-full border-b border-border-neutral-muted">
      {TABS.map(tab => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onTabChange(tab.value)}
          className={cn(
            'relative flex h-11 flex-1 cursor-pointer items-center justify-center body-1-semibold transition-colors',
            activeTab === tab.value ? 'text-text-neutral-primary' : 'text-text-neutral-tertiary'
          )}
        >
          {tab.label}
          {activeTab === tab.value && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-text-neutral-primary" />
          )}
        </button>
      ))}
    </div>
  );
}

export default TournamentStatusTab;
