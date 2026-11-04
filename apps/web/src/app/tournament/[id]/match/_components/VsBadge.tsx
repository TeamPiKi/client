import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

import VsBadgeImage from '../_assets/vs-badge.svg';

/** 결승 파편 8개 — 45° 간격, 색은 번갈아 */
const SPARK_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

type VsBadgeProps = {
  isPicked?: boolean;
  isFinal?: boolean;
};

function VsBadge({ isPicked = false, isFinal = false }: VsBadgeProps) {
  const flameClassName = isFinal
    ? cn('vs-flame-final', isPicked && 'scale-[1.7] opacity-0')
    : cn('vs-flame', isPicked && 'scale-0 -rotate-[40deg] opacity-0');

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ top: 112, zIndex: Z_INDEX.BASE_IMAGE + 3 }}
    >
      <div className={flameClassName}>
        <VsBadgeImage />
      </div>
      {isPicked && isFinal && (
        <div className="absolute top-1/2 left-1/2 size-0">
          {SPARK_ANGLES.map((angle, index) => (
            <div key={angle} className="absolute top-0 left-0" style={{ rotate: `${angle}deg` }}>
              <div
                className={cn(
                  'vs-spark absolute -top-[7px] -left-0.5 h-3.5 w-1 rounded-sm',
                  index % 2 === 0 ? 'bg-gray-900' : 'bg-sky-blue-400'
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VsBadge;
