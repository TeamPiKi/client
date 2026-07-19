import type { ComponentProps } from 'react';

import { TOURNAMENT_STATUS } from '@/consts/tournament';
import { cn } from '@/utils/cn';

import { type StatusChipStyleProps, statusChipStyles } from './statusChip.style';

/** DS 0719 — 내부 아이콘 제거, 텍스트만 표시 */
const STATUS_CONFIG = {
  [TOURNAMENT_STATUS.PENDING]: { label: '담는 중' },
  [TOURNAMENT_STATUS.IN_PROGRESS]: { label: '플레이 중' },
  [TOURNAMENT_STATUS.COMPLETED]: { label: '완료' },
} as const;

type StatusChipProps = Omit<ComponentProps<'span'>, 'children'> &
  StatusChipStyleProps & {
    status: NonNullable<StatusChipStyleProps['status']>;
  };

function StatusChip({ status, className, ...rest }: StatusChipProps) {
  const { label } = STATUS_CONFIG[status];

  return (
    <span className={cn(statusChipStyles({ status }), className)} {...rest}>
      {label}
    </span>
  );
}

export default StatusChip;
