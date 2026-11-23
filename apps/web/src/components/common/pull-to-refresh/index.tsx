import Spinner from '@/components/spinner';
import { cn } from '@/utils/cn';

import { INDICATOR_HEIGHT } from './pullToRefresh.const';

type PullToRefreshProps = {
  pullDistance: number;
  isPulling: boolean;
  isRefreshing: boolean;
};

function PullToRefresh({ pullDistance, isPulling, isRefreshing }: PullToRefreshProps) {
  return (
    <div
      className={cn('shrink-0 overflow-hidden', !isPulling && 'transition-[height] duration-200')}
      style={{ height: pullDistance }}
    >
      <div className="flex items-center justify-center" style={{ height: INDICATOR_HEIGHT }}>
        {(isPulling || isRefreshing) && <Spinner size={24} />}
      </div>
    </div>
  );
}

export default PullToRefresh;
