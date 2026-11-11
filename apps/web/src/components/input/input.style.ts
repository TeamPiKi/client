import { cva } from 'class-variance-authority';

export const inputStyles = cva(
  'flex items-center gap-2 rounded-xl border-[1.4px] p-[14.6px] transition-colors',
  {
    variants: {
      status: {
        default: 'border-gray-100 bg-white focus-within:border-border-accent',
        error: 'border-red-400 bg-white',
        disabled: 'border-gray-100 bg-gray-50',
      },
    },
    defaultVariants: {
      status: 'default',
    },
  }
);
