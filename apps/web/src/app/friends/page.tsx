import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { Header, HeaderIcon } from '@/components/header';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import { friendsQueryOptions } from './_apis/getFriends';
import { userBlocksQueryOptions } from './_apis/getUserBlocks';
import FriendsContent from './_components/FriendsContent';

async function FriendsPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    serverPrefetch(() => queryClient.fetchQuery(friendsQueryOptions)),
    serverPrefetch(() => queryClient.fetchQuery(userBlocksQueryOptions)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-dvh flex-col bg-bg-layer-basement pt-padding-top">
        <Header
          className="px-5"
          left={<HeaderIcon name="BACK" className="size-7.5" />}
          center={<h1 className="heading-1-bold text-text-neutral-primary">내 친구 목록</h1>}
        />

        <FriendsContent />
      </main>
    </HydrationBoundary>
  );
}

export default FriendsPage;
