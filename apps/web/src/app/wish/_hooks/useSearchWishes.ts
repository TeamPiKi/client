import { useInfiniteQuery } from '@tanstack/react-query';

import { wishesInfiniteQueryOptions } from '@/apis/getWishes';

export const useSearchWishes = (keyword: string | null) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    ...wishesInfiniteQueryOptions({ q: keyword ?? '' }),
    enabled: keyword !== null,
  });

  const searchWishesData = data?.pages.flatMap(page => page.data) ?? [];

  return {
    searchWishesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSearchWishesPending: isPending,
  };
};
