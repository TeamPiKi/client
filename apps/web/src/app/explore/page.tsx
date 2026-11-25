import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { Header } from '@/components/header';
import Spacing from '@/components/spacing';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import { recentWishesInfiniteQueryOptions } from './_apis/getRecentWishes';
import { friendWishesInfiniteQueryOptions } from './_common/_apis/getFriendWishes';
import ExploreProfileLink from './_components/ExploreProfileLink';
import FriendWishSection from './_components/FriendWishSection';
import RecentWishSection from './_components/RecentWishSection';
import RecentWishSectionSkeleton from './_components/RecentWishSectionSkeleton';
import ThumbnailWishSectionSkeleton from './_components/ThumbnailWishSectionSkeleton';
import WinnerWishSection from './_components/WinnerWishSection';

async function ExplorePage() {
  const queryClient = getQueryClient();

  await Promise.all([
    serverPrefetch(() => queryClient.fetchInfiniteQuery(friendWishesInfiniteQueryOptions(null))),
    serverPrefetch(() => queryClient.fetchInfiniteQuery(recentWishesInfiniteQueryOptions)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
    </HydrationBoundary>
  );
}

export default ExplorePage;
