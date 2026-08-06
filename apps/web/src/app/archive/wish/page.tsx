import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import type { GetWishlistApiResponseT } from '@/apis/getWishlist';
import { getWishlist } from '@/apis/getWishlist';
import { getQueryClient } from '@/utils/queryClient';

import WishContent from './_components/WishContent';

async function ArchiveWishPage() {
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
      <WishContent />
    </HydrationBoundary>
  );
}

export default ArchiveWishPage;
