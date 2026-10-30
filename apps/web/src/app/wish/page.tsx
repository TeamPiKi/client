import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { foldersQueryOptions } from '@/apis/getFolders';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import WishListContent from './_components/WishListContent';

async function WishPage() {
  const queryClient = getQueryClient();

  await serverPrefetch(() => queryClient.fetchQuery(foldersQueryOptions));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-dvh flex-col bg-bg-layer-basement pb-46">
        <WishListContent />
      </main>
    </HydrationBoundary>
  );
}

export default WishPage;
