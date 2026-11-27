import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { Header } from '@/components/header';
import Spacing from '@/components/spacing';
import { Z_INDEX } from '@/consts/zIndex';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import { recentWishesInfiniteQueryOptions } from './_apis/getRecentWishes';
import { friendWishesInfiniteQueryOptions } from './_common/_apis/getFriendWishes';
import { winnerWishesInfiniteQueryOptions } from './_common/_apis/getWinnerWishes';
import ExploreProfileLink from './_components/ExploreProfileLink';
import ExplorePullToRefresh from './_components/ExplorePullToRefresh';
import FriendWishSection from './_components/FriendWishSection';
import RecentWishSection from './_components/RecentWishSection';
import RecentWishSectionSkeleton from './_components/RecentWishSectionSkeleton';
import ThumbnailWishSectionSkeleton from './_components/ThumbnailWishSectionSkeleton';
import WinnerWishSection from './_components/WinnerWishSection';

async function ExplorePage() {
  const queryClient = getQueryClient();

  await Promise.all([
    serverPrefetch(() => queryClient.fetchInfiniteQuery(winnerWishesInfiniteQueryOptions)),
    serverPrefetch(() => queryClient.fetchInfiniteQuery(friendWishesInfiniteQueryOptions(null))),
    serverPrefetch(() => queryClient.fetchInfiniteQuery(recentWishesInfiniteQueryOptions)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-dvh flex-col bg-bg-layer-default pb-32">
        <div
          className="sticky top-0 bg-bg-layer-default px-5 pt-padding-top pb-2"
          style={{ zIndex: Z_INDEX.STICKY_HEADER }}
        >
          <Header
            left={<h1 className="heading-1-bold text-text-neutral-primary">탐색</h1>}
            right={<ExploreProfileLink />}
          />
          <ExplorePullToRefresh />
        </div>

        <Spacing size={28} />

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
