import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { wishlistInfiniteQueryOptions } from '@/apis/getWishlist';

export const useGetWishlist = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    wishlistInfiniteQueryOptions
  );

  const wishlistData = data.pages.flatMap(page => page.data);

  return { wishlistData, fetchNextPage, hasNextPage, isFetchingNextPage };
};
