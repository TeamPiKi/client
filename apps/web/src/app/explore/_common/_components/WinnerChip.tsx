import { type VariantProps, cva } from 'class-variance-authority';
import type { CSSProperties } from 'react';

import { BadgeIconFill } from '@/assets/icons';
import { cn } from '@/utils/cn';

const winnerChipStyles = cva('flex items-center bg-bg-neutral-primary text-text-neutral-inverse', {
  variants: {
    /** sm: 카드용 · lg: 위시 상세 이미지용 */
    size: {
      sm: 'gap-0.5 py-0.5 pr-1.5 pl-1 caption-2-medium [&>svg]:size-3',
      lg: 'gap-[2.6px] py-[2.6px] pr-[7.8px] pl-[5.2px] text-[13px] leading-[23.4px] font-medium tracking-[-0.52px] [&>svg]:size-[15.6px]',
    },
  },
  defaultVariants: { size: 'sm' },
});

type WinnerChipProps = VariantProps<typeof winnerChipStyles> & {
  className?: string;
  style?: CSSProperties;
};

function WinnerChip({ size, className, style }: WinnerChipProps) {
  return (
    <span style={style} className={cn(winnerChipStyles({ size }), className)}>
      <BadgeIconFill aria-hidden />
      1위
    </span>
  );
}

export default WinnerChip;
