import Skeleton from '@/components/skeleton';

/** prefetch 되는 동안 노출할 카드 개수. 리스트 limit(3)과 맞춤. */
const SKELETON_COUNT = 3;

function TournamentCardSkeleton() {
  return (
    <div className="flex w-full items-start gap-2.5 rounded-xl bg-base-50 px-5 py-3">
      {/* 썸네일 */}
      <div className="relative h-[72px] w-[85px] shrink-0">
        <Skeleton className="absolute top-1 left-0 size-[63px] rounded-[16px] border-[3px] border-white" />
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-1 flex-col gap-2 self-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center -space-x-1.5">
          <Skeleton shape="circle" className="size-6 border-2 border-base-50" />
          <Skeleton shape="circle" className="size-6 border-2 border-base-50" />
        </div>
      </div>
    </div>
  );
}

function TournamentListSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <TournamentCardSkeleton key={index} />
      ))}
    </>
  );
}

export default TournamentListSkeleton;
