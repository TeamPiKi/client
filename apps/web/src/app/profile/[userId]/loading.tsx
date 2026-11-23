import { Header, HeaderIcon } from '@/components/header';
import Skeleton from '@/components/skeleton';
import Spacing from '@/components/spacing';

const FOLDER_SKELETON_COUNT = 4;

function ProfileLoading() {
  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-basement pb-10" aria-busy>
      <div className="bg-bg-layer-default pt-padding-top pb-2">
        <Header className="px-5" left={<HeaderIcon name="BACK" className="size-7.5" />} />

        <Spacing size={18} />

        <div className="flex flex-col items-center gap-4.5 px-5">
          <Skeleton shape="circle" className="size-20" />
          <Skeleton className="h-7 w-32" />
        </div>

        <Spacing size={24} />

        <div className="px-5">
          <Skeleton className="h-[54px] w-full rounded-[12px]" />
        </div>

        <Spacing size={24} />

        <div className="px-5 py-2.5">
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-1.5 gap-y-8">
        {Array.from({ length: FOLDER_SKELETON_COUNT }).map((_, index) => (
          <li key={index} className="flex flex-col">
            <Skeleton className="aspect-[201/248] w-full rounded-none" />
            <div className="flex flex-col items-center gap-1.5 p-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default ProfileLoading;
