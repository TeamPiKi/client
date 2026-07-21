import Skeleton from '@/components/skeleton';

function TournamentCardSkeleton() {
  return (
    <article className="flex w-full items-start gap-2.5 rounded-xl bg-base-50 py-3 pr-3 pl-5">
      {/* 이미지 썸네일 */}
      <div className="relative h-[72px] w-[85px] shrink-0">
        <div className="absolute top-0 left-[13px] flex size-[72px] items-center justify-center">
          <Skeleton className="size-[63px] origin-center scale-[0.918] rotate-10 rounded-[16px] border-[3px] border-white opacity-60" />
        </div>
        <Skeleton className="absolute top-1 left-0 size-[63px] rounded-[16px] border-[3px] border-white" />
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-1 flex-col items-start gap-2 self-center">
        <div className="flex items-center gap-2">
          {/* 상태 칩 */}
          <Skeleton className="h-[26px] w-14 rounded-lg" />
          {/* 이름 */}
          <Skeleton className="h-[22px] w-32" />
        </div>

        {/* 참여자 프로필 */}
        <Skeleton shape="circle" className="size-5 border-[1.6px] border-white" />
      </div>
    </article>
  );
}

export default TournamentCardSkeleton;
