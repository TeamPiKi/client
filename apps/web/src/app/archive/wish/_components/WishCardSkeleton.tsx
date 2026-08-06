import Skeleton from '@/components/skeleton';

function WishCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden bg-bg-layer-basement">
      <Skeleton className="aspect-[201/166] w-full rounded-none" />
      <div className="flex h-[124px] flex-col items-start gap-2.5 self-stretch p-4">
        <div className="flex flex-col gap-1 self-stretch">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <Skeleton className="h-5 w-12 rounded-[4px]" />
      </div>
    </div>
  );
}

export default WishCardSkeleton;
