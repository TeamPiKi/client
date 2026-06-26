import { type VariantProps, cva } from 'class-variance-authority';

import { TOURNAMENT_STATUS } from '@/consts/tournament';

export const statusChipStyles = cva(
  'inline-flex w-[67px] shrink-0 items-center justify-center gap-1 rounded-lg px-2 py-1 caption-1-semibold',
  {
    variants: {
      status: {
        [TOURNAMENT_STATUS.PENDING]: 'bg-yellow-50 text-yellow-700',
        [TOURNAMENT_STATUS.IN_PROGRESS]: 'bg-green-50 text-green-700',
        [TOURNAMENT_STATUS.COMPLETED]: 'bg-blue-50 text-blue-700',
      },
    },
    defaultVariants: {
      status: TOURNAMENT_STATUS.PENDING,
    },
  }
);

export type StatusChipStyleProps = VariantProps<typeof statusChipStyles>;
