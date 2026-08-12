import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { wishlistInfiniteQueryOptions } from '@/apis/getWishlist';
import { getQueryClient } from '@/utils/queryClient';

import WishContent from './_components/WishContent';

async function ArchiveWishPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(wishlistInfiniteQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WishContent />
    </HydrationBoundary>
  );
}

export default ArchiveWishPage;
