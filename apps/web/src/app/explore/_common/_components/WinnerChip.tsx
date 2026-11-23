import type { CSSProperties } from 'react';

import { BadgeIconFill } from '@/assets/icons';
import { cn } from '@/utils/cn';

type WinnerChipProps = {
  className?: string;
  style?: CSSProperties;
};

function WinnerChip({ className, style }: WinnerChipProps) {
  return (
    <span
      style={style}
      className={cn(
        'flex items-center gap-0.5 bg-bg-neutral-primary py-0.5 pr-1.5 pl-1 caption-2-medium text-text-neutral-inverse',
        className
      )}
    >
      <BadgeIconFill className="size-3" aria-hidden />
      1위
    </span>
  );
}

export default WinnerChip;
