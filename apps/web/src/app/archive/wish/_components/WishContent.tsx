import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getWishlist } from '@/apis/getWishlist';
import type { ApiResponseT } from '@/types/api';
import type { GetWishlistResponseT } from '@/types/wish';
import { getQueryClient } from '@/utils/queryClient';

import WishContentClient from './WishContentClient';

async function WishContent() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['wishlists'],
    queryFn: ({ pageParam }) => getWishlist(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (page: ApiResponseT<GetWishlistResponseT[]>) =>
      page.pageResponse.hasNext ? page.pageResponse.nextCursor : null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WishContentClient />
    </HydrationBoundary>
  );
}

export default WishContent;
