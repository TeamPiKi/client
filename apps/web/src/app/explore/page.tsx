import { Suspense } from 'react';

import { Header } from '@/components/header';
import Spacing from '@/components/spacing';

import ExploreProfileLink from './_components/ExploreProfileLink';
import FriendWishSection from './_components/FriendWishSection';
import RecentWishSection from './_components/RecentWishSection';
import RecentWishSectionSkeleton from './_components/RecentWishSectionSkeleton';
import ThumbnailWishSectionSkeleton from './_components/ThumbnailWishSectionSkeleton';
import WinnerWishSection from './_components/WinnerWishSection';

function ExplorePage() {
  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-32">
      <Header
        className="px-5"
        left={<h1 className="heading-1-bold text-text-neutral-primary">탐색</h1>}
        right={<ExploreProfileLink />}
      />

      <Spacing size={36} />

      <div className="flex flex-col gap-12">
        <Suspense fallback={<ThumbnailWishSectionSkeleton />}>
          <WinnerWishSection />
        </Suspense>
        <Suspense fallback={<ThumbnailWishSectionSkeleton />}>
          <FriendWishSection />
        </Suspense>
        <Suspense fallback={<RecentWishSectionSkeleton />}>
          <RecentWishSection />
        </Suspense>
      </div>
    </main>
  );
}

export default ExplorePage;
