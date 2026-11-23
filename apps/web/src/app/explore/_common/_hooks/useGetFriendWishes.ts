import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { friendWishesInfiniteQueryOptions } from '../_apis/getFriendWishes';

export const useGetFriendWishes = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isFetchNextPageError } =
    useSuspenseInfiniteQuery(friendWishesInfiniteQueryOptions);

  const friendWishesData = data.pages.flatMap(page => page.data);

  return {
    friendWishesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  };
};
