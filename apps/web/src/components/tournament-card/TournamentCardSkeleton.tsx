import Skeleton from '@/components/skeleton';

function TournamentCardSkeleton() {
  return (
    <article className="flex w-full flex-col gap-2 rounded-xl bg-bg-layer-default px-6 py-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-[67px] rounded-lg" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="size-[22px]" />
      </div>
      <div className="flex items-end justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton shape="circle" className="h-[22px] w-16" />
      </div>
    </article>
  );
}

export default TournamentCardSkeleton;
