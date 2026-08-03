import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { getWishlist } from '@/apis/getWishlist';

export const useGetWishlist = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: ['wishlists'],
    queryFn: ({ pageParam }) => getWishlist(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: page => (page.pageResponse.hasNext ? page.pageResponse.nextCursor : null),
  });

  const wishlistData = data.pages.flatMap(page => page.data);

  return { wishlistData, fetchNextPage, hasNextPage, isFetchingNextPage };
};
