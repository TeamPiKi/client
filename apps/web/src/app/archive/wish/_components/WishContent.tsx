import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import type { GetWishlistApiResponseT } from '@/apis/getWishlist';
import { getWishlist } from '@/apis/getWishlist';
import { getQueryClient } from '@/utils/queryClient';

import WishContentClient from './WishContentClient';

async function WishContent() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['wishlists'],
    queryFn: ({ pageParam }) => getWishlist(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (page: GetWishlistApiResponseT) =>
      page.pageResponse.hasNext ? page.pageResponse.nextCursor : null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WishContentClient />
    </HydrationBoundary>
  );
}

export default WishContent;
