import type { ComponentProps } from 'react';

import { TOURNAMENT_STATUS } from '@/consts/tournament';
import { cn } from '@/utils/cn';

import { type StatusChipStyleProps, statusChipStyles } from './statusChip.style';

const STATUS_LABEL = {
  [TOURNAMENT_STATUS.PENDING]: '담는 중',
  [TOURNAMENT_STATUS.IN_PROGRESS]: '플레이 중',
  [TOURNAMENT_STATUS.COMPLETED]: '완료',
} as const;

type StatusChipProps = Omit<ComponentProps<'span'>, 'children'> &
  StatusChipStyleProps & {
    status: NonNullable<StatusChipStyleProps['status']>;
  };

function StatusChip({ status, className, ...rest }: StatusChipProps) {
  return (
    <span className={cn(statusChipStyles({ status }), className)} {...rest}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export default StatusChip;
