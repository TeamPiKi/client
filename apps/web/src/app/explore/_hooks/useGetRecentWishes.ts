import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { recentWishesInfiniteQueryOptions } from '../_apis/getRecentWishes';

export const useGetRecentWishes = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isFetchNextPageError } =
    useSuspenseInfiniteQuery(recentWishesInfiniteQueryOptions);

  const recentWishesData = data.pages.flatMap(page => page.data.wishes);
  const recentUpdatedAt = data.pages[0]?.data.updatedAt ?? null;

  return {
    recentWishesData,
    recentUpdatedAt,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  };
};
