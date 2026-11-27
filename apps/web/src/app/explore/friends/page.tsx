import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { Header, HeaderIcon } from '@/components/header';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import { friendWishesInfiniteQueryOptions } from '../_common/_apis/getFriendWishes';
import { exploreFriendsQueryOptions } from './_apis/getExploreFriends';
import FriendWishContent from './_components/FriendWishContent';

type ExploreFriendsPageProps = {
  searchParams: Promise<{ friend?: string }>;
};

async function ExploreFriendsPage({ searchParams }: ExploreFriendsPageProps) {
  const { friend } = await searchParams;
  const queryClient = getQueryClient();

  await serverPrefetch(() => queryClient.fetchQuery(exploreFriendsQueryOptions));
  const friends = queryClient.getQueryData(exploreFriendsQueryOptions.queryKey) ?? [];
  const activeFriendId = friends.some(({ userId }) => userId === friend) ? (friend ?? null) : null;
  await serverPrefetch(() =>
    queryClient.fetchInfiniteQuery(friendWishesInfiniteQueryOptions(activeFriendId))
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-dvh flex-col bg-bg-layer-default pt-padding-top pb-10">
        <Header
          className="px-5"
          left={<HeaderIcon name="BACK" className="size-7.5" />}
          center={<h1 className="heading-1-bold text-text-neutral-primary">친구가 담은 위시</h1>}
        />

        <Suspense>
          <FriendWishContent />
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}

export default ExploreFriendsPage;
