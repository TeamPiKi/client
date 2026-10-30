import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

import { wishesInfiniteQueryOptions } from '@/apis/getWishes';
import type { GetWishesRequestT } from '@/types/wish';

export const useGetWishes = (request: GetWishesRequestT = {}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    wishesInfiniteQueryOptions(request)
  );

  const wishesData = data.pages.flatMap(page => page.data);

  return { wishesData, fetchNextPage, hasNextPage, isFetchingNextPage };
};
