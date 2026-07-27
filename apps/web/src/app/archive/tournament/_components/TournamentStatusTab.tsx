'use client';

import type { ComponentType, SVGProps } from 'react';

import { BasketIconOutline, ReciptIconOutline } from '@/assets/icons';
import { cn } from '@/utils/cn';

import type { TournamentStatusTabT } from '../_consts/tournamentTab';

type Props = {
  activeTab: TournamentStatusTabT;
  onTabChange: (tab: TournamentStatusTabT) => void;
};

const TABS: {
  value: TournamentStatusTabT;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { value: 'ongoing', label: '진행 중', Icon: BasketIconOutline },
  { value: 'completed', label: '완료', Icon: ReciptIconOutline },
];

function TournamentStatusTab({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex w-full border-b border-border-neutral-muted">
      {TABS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onTabChange(value)}
          className={cn(
            'relative flex h-11 flex-1 cursor-pointer items-center justify-center gap-1 body-1-semibold transition-colors',
            activeTab === value ? 'text-text-neutral-primary' : 'text-text-neutral-tertiary'
          )}
        >
          <Icon className="size-5" />
          {label}
          {activeTab === value && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-text-neutral-primary" />
          )}
        </button>
      ))}
    </div>
  );
}

export default TournamentStatusTab;
