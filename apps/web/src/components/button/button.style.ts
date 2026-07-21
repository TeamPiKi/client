import { type VariantProps, cva } from 'class-variance-authority';

export const buttonStyles = cva(
  'inline-flex cursor-pointer items-center justify-center overflow-hidden transition-colors disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: [
          'border text-text-neutral-inverse',
          'bg-bg-neutral-primary border-bg-neutral-primary',
          'active:bg-gray-400 active:border-gray-400',
          'disabled:bg-gray-200 disabled:border-gray-200',
        ],
        secondary: [
          'text-text-neutral-secondary',
          'bg-bg-neutral-tertiary',
          'active:bg-gray-50 active:text-text-neutral-primary',
          'disabled:bg-gray-50 disabled:text-text-neutral-tertiary',
        ],
      },
      size: {
        sm: 'rounded-[12px] body-2-semibold',
        md: 'rounded-[12px] body-1-semibold',
        lg: 'h-[54px] w-full rounded-[12px] body-1-semibold',
        xl: 'rounded-[12px] body-1-semibold',
      },
      icon: {
        none: 'gap-0',
        leading: 'gap-2',
        only: 'rounded-full',
      },
    },
    compoundVariants: [
      { icon: ['none', 'leading'], size: 'sm', className: 'px-4 py-[10px]' },
      { icon: ['none', 'leading'], size: 'md', className: 'px-[18px] py-[10px]' },
      { icon: ['none', 'leading'], size: 'lg', className: 'px-5 py-3' },
      { icon: 'only', size: 'sm', className: 'size-10 p-[10px]' },
      { icon: 'only', size: 'md', className: 'size-12 p-3' },
      { icon: 'only', size: 'lg', className: 'size-14 p-[14px]' },
      { icon: 'only', size: 'xl', className: 'size-[64.899px] p-[15.447px]' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      icon: 'none',
    },
  }
);

export type ButtonStyleProps = VariantProps<typeof buttonStyles>;
