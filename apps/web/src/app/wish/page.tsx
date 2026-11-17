import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { foldersQueryOptions } from '@/apis/getFolders';
import { wishesInfiniteQueryOptions } from '@/apis/getWishes';
import { wishesCountQueryOptions } from '@/apis/getWishesCount';
import { IS_WISH_FOLDER_ENABLED } from '@/consts/featureFlag';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import WishContent from './_archive/_components/WishContent';
import WishListContent from './_components/WishListContent';

async function WishPage() {
  const queryClient = getQueryClient();

  if (!IS_WISH_FOLDER_ENABLED) {
    await serverPrefetch(() => queryClient.fetchInfiniteQuery(wishesInfiniteQueryOptions()));

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <WishContent />
      </HydrationBoundary>
    );
  }

  await Promise.all([
    serverPrefetch(() => queryClient.fetchQuery(foldersQueryOptions)),
    serverPrefetch(() => queryClient.fetchInfiniteQuery(wishesInfiniteQueryOptions())),
    serverPrefetch(() => queryClient.fetchQuery(wishesCountQueryOptions())),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main data-wide-layout className="flex min-h-dvh flex-col bg-bg-layer-basement pb-46">
        <WishListContent />
      </main>
    </HydrationBoundary>
  );
}

export default WishPage;
