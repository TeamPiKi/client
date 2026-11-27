import Skeleton from '@/components/skeleton';

const CARD_COUNT = 3;

function ThumbnailWishSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy>
      <div className="flex flex-col gap-0.5 px-5">
        <Skeleton className="h-[26px] w-36" />
        <Skeleton className="h-5 w-52" />
      </div>
      <ul className="flex gap-2.5 overflow-hidden px-5">
        {Array.from({ length: CARD_COUNT }).map((_, index) => (
          <li key={index} className="flex w-[133px] shrink-0 flex-col">
            <Skeleton className="aspect-[133/140] w-full rounded-lg" />
            <div className="flex flex-col gap-1 p-2">
              <Skeleton className="h-4.5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ThumbnailWishSectionSkeleton;
