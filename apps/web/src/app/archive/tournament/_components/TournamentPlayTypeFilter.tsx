'use client';

import type { ComponentType, SVGProps } from 'react';

import { GroupIconFill, PersonIconFill } from '@/assets/icons';
import { cn } from '@/utils/cn';

import { PLAY_TYPE_FILTER, type TournamentPlayTypeFilterT } from '../_consts/tournamentPlayType';

type Props = {
  activeFilter: TournamentPlayTypeFilterT;
  onFilterChange: (filter: TournamentPlayTypeFilterT) => void;
};

const FILTERS: {
  value: TournamentPlayTypeFilterT;
  label: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { value: PLAY_TYPE_FILTER.ALL, label: '전체' },
  { value: PLAY_TYPE_FILTER.SOLO, label: '솔로플레이', Icon: PersonIconFill },
  { value: PLAY_TYPE_FILTER.SOCIAL, label: '소셜플레이', Icon: GroupIconFill },
];

function TournamentPlayTypeFilter({ activeFilter, onFilterChange }: Props) {
  return (
    <div role="group" aria-label="플레이 유형 필터" className="flex gap-1">
      {FILTERS.map(({ value, label, Icon }) => {
        const isActive = activeFilter === value;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange(value)}
            className={cn(
              'flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-full border px-3 body-2-semibold transition-colors',
              isActive
                ? 'border-border-neutral-primary bg-bg-neutral-secondary text-text-neutral-inverse'
                : 'border-gray-75 bg-bg-layer-default text-text-neutral-secondary'
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  'size-4',
                  isActive ? 'text-icon-neutral-inverse' : 'text-icon-neutral-secondary'
                )}
                aria-hidden
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default TournamentPlayTypeFilter;
