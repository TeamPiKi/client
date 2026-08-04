import Skeleton from '@/components/skeleton';

type MatchSkeletonProps = {
  isFinal?: boolean;
};

/** VsSection 과 같은 골격 — 다음 매치를 서버에서 받아오는 동안 노출 */
function MatchSkeleton({ isFinal = false }: MatchSkeletonProps) {
  return (
    <div className="w-full" aria-label="다음 대결을 불러오는 중" aria-busy>
      {!isFinal && <div className="h-13.5" />}

      <div className="relative flex gap-3">
        {[0, 1].map(index => (
          <div key={index} className="flex min-w-0 flex-1 flex-col items-center">
            {!isFinal && <div className="h-8.25" />}
            <div className="w-37 overflow-hidden rounded-xl bg-bg-layer-default">
              <Skeleton className="h-30.75 w-full rounded-none" />
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-4.5 w-full" />
                <Skeleton className="h-5.5 w-2/3" />
              </div>
            </div>
          </div>
        ))}

        <div
          className="absolute left-1/2 z-10 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg-neutral-secondary text-[12.026px] leading-[17.18px] font-semibold tracking-[-0.515px] text-white"
          style={{ top: isFinal ? 61.5 : 156 }}
        >
          VS
        </div>
      </div>
    </div>
  );
}

export default MatchSkeleton;
