import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { wishesInfiniteQueryOptions } from '@/apis/getWishes';
import { wishesCountQueryOptions } from '@/apis/getWishesCount';

export const useSearchWishes = (keyword: string | null) => {
  const request = { q: keyword ?? '' };
  const enabled = keyword !== null;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    ...wishesInfiniteQueryOptions(request),
    enabled,
  });
  const { data: searchWishesCountData } = useQuery({
    ...wishesCountQueryOptions(request),
    enabled,
  });

  const searchWishesData = data?.pages.flatMap(page => page.data) ?? [];

  return {
    searchWishesData,
    searchWishesCountData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSearchWishesPending: isPending,
  };
};
