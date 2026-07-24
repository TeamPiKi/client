import { type VariantProps, cva } from 'class-variance-authority';

export const tournamentEmptyStateStyles = cva('flex flex-col items-center', {
  variants: {
    variant: {
      default: 'gap-[25px]',
      muted: 'gap-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const tournamentEmptyStateIconStyles = cva('size-[60px]', {
  variants: {
    variant: {
      default: 'text-sky-blue-400',
      muted: 'text-gray-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const tournamentEmptyStateTextGroupStyles = cva('flex w-full flex-col items-center', {
  variants: {
    variant: {
      default: 'gap-3',
      muted: 'gap-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const tournamentEmptyStateTitleStyles = cva('text-center', {
  variants: {
    variant: {
      default: 'heading-1-semibold text-text-neutral-primary',
      muted: 'heading-2-semibold text-gray-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type TournamentEmptyStateVariantProps = VariantProps<typeof tournamentEmptyStateStyles>;
