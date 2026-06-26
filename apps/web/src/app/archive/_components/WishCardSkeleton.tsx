import Skeleton from '@/components/skeleton';

function WishCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white">
      <Skeleton className="h-[143px] w-full" />
      <div className="flex flex-col items-center gap-[9px] px-3 py-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}

export default WishCardSkeleton;
