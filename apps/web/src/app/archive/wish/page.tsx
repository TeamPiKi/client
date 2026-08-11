import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getWishlist } from '@/apis/getWishlist';
import type { ApiResponseT } from '@/types/api';
import type { GetWishlistResponseT } from '@/types/wish';
import { getQueryClient } from '@/utils/queryClient';
import { serverPrefetch } from '@/utils/serverPrefetch';

import WishContent from './_components/WishContent';

async function ArchiveWishPage() {
  const queryClient = getQueryClient();

  await serverPrefetch(() =>
    queryClient.fetchInfiniteQuery({
      queryKey: ['wishlists'],
      queryFn: ({ pageParam }) => getWishlist(pageParam),
      initialPageParam: null as string | null,
      getNextPageParam: (page: ApiResponseT<GetWishlistResponseT[]>) =>
        page.pageResponse.hasNext ? page.pageResponse.nextCursor : null,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WishContent />
    </HydrationBoundary>
  );
}

export default ArchiveWishPage;
