import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { wishlistInfiniteQueryOptions } from '@/apis/getWishlist';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import WishContent from './_components/WishContent';

async function ArchiveWishPage() {
  const queryClient = getQueryClient();

  await serverPrefetch(() => queryClient.fetchInfiniteQuery(wishlistInfiniteQueryOptions));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WishContent />
    </HydrationBoundary>
  );
}

export default ArchiveWishPage;
