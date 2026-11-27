import { Header, HeaderIcon } from '@/components/header';
import Skeleton from '@/components/skeleton';

const CARD_COUNT = 4;

function ExploreFolderSkeleton() {
  return (
    <div aria-busy>
      <Header
        className="px-5"
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={<Skeleton className="h-7 w-28" />}
      />
      <ul className="mt-6 grid grid-cols-2">
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

export default ExploreFolderSkeleton;
