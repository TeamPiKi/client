import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import type { WishlistPageT } from '@/apis/getWishlist';
import { getWishlist } from '@/apis/getWishlist';
import { getQueryClient } from '@/utils/queryClient';

import WishContentClient from './client';

async function WishContent() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['wishlists'],
    queryFn: ({ pageParam }) => getWishlist(pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (page: WishlistPageT) => (page.hasNext ? page.nextCursor : null),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WishContentClient />
    </HydrationBoundary>
  );
}

export default WishContent;
