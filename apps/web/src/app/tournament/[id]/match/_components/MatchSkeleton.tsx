import Skeleton from '@/components/skeleton';

import VsBadge from './VsBadge';

/** VsSection 과 같은 골격 — 다음 매치를 서버에서 받아오는 동안 노출 */
function MatchSkeleton() {
  return (
    <div
      className="relative flex justify-center gap-[22px]"
      aria-label="다음 대결을 불러오는 중"
      aria-busy
    >
      {[0, 1].map(index => (
        <div key={index} className="w-[148px] overflow-hidden rounded-[20px] bg-bg-layer-default">
          <Skeleton className="h-[123px] w-full rounded-none" />
          <div className="flex h-[102px] flex-col items-center justify-center gap-1 px-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5.5 w-2/3" />
          </div>
        </div>
      ))}
      <VsBadge />
    </div>
  );
}

export default MatchSkeleton;
