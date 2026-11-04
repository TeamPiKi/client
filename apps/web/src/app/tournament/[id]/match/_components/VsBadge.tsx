import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

import VsBadgeImage from '../_assets/vs-badge.svg';

type VsBadgeProps = {
  className?: string;
};

function VsBadge({ className }: VsBadgeProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2',
        className
      )}
      style={{ top: 112, zIndex: Z_INDEX.BASE_IMAGE + 3 }}
    >
      <VsBadgeImage />
    </div>
  );
}

export default VsBadge;
