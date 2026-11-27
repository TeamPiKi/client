import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { winnerWishesInfiniteQueryOptions } from '../_apis/getWinnerWishes';

export const useGetWinnerWishes = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isFetchNextPageError } =
    useSuspenseInfiniteQuery(winnerWishesInfiniteQueryOptions);

  const winnerWishesData = data.pages.flatMap(page => page.data);

  return {
    winnerWishesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  };
};
