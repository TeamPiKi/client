import { Suspense } from 'react';

import Skeleton from '@/components/skeleton';

function LoadingFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-5 pt-padding-top">
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col items-center">
          <Skeleton className="h-7 w-48" />
        </div>

        <Skeleton className="h-[66px] w-full rounded-xl" />

        <div className="flex items-center justify-center">
          <Skeleton className="h-[40px] w-48 rounded-[24px]" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <Skeleton className="aspect-356/464 w-full rounded-xl" />
        </div>
      </div>

      <div className="pb-8">
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}
