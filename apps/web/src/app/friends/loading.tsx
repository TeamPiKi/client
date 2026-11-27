import { Header, HeaderIcon } from '@/components/header';
import Skeleton from '@/components/skeleton';

const FRIEND_SKELETON_COUNT = 5;

function FriendsLoading() {
  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-basement pt-padding-top" aria-busy>
      <Header
        className="px-5"
        left={<HeaderIcon name="BACK" className="size-7.5" />}
        center={<h1 className="heading-1-bold text-text-neutral-primary">내 친구 목록</h1>}
      />

      <div className="px-5 pt-4">
        <Skeleton className="h-10 w-full" />
      </div>

      <ul className="flex flex-col gap-1.5 pt-7">
        {Array.from({ length: FRIEND_SKELETON_COUNT }).map((_, index) => (
          <li key={index} className="flex h-17 items-center gap-3.5 p-5">
            <Skeleton shape="circle" className="size-7.5 shrink-0" />
            <div className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default FriendsLoading;
