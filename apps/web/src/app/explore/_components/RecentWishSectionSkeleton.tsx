import Skeleton from '@/components/skeleton';

const CARD_COUNT = 4;

function RecentWishSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy>
      <div className="flex flex-col gap-0.5 px-5">
        <Skeleton className="h-[26px] w-32" />
        <Skeleton className="h-5 w-28" />
      </div>
      <ul className="grid grid-cols-2">
        {Array.from({ length: CARD_COUNT }).map((_, index) => (
          <li key={index} className="flex flex-col">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="flex h-30 flex-col gap-1 px-3 py-2">
              <Skeleton className="h-4.5 w-28" />
              <Skeleton className="h-5 w-20" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentWishSectionSkeleton;
