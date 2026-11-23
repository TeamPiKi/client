import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { recentWishesInfiniteQueryOptions } from '../_apis/getRecentWishes';

export const useGetRecentWishes = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isFetchNextPageError } =
    useSuspenseInfiniteQuery(recentWishesInfiniteQueryOptions);

  const recentWishesData = data.pages.flatMap(page => page.data);

  return {
    recentWishesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  };
};
