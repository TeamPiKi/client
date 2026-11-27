import { environmentManager, infiniteQueryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';

import type { GetRecentWishesResponseT, RecentWishesT } from '../_common/_types/explore';

export const getRecentWishes = async (
  cursor: string | null = null
): Promise<ApiResponseT<RecentWishesT>> => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<ApiResponseT<GetRecentWishesResponseT>>(ENDPOINTS.EXPLORE_RECENT, {
    params: { size: 20, ...(cursor ? { cursor } : {}) },
  });

  return {
    ...data,
    data: {
      updatedAt: data.data.updatedAt,
      wishes: data.data.wishes.map(({ wishId, addedAt, saved, savedWishId, item }) => ({
        wishId,
        item,
        savedAt: addedAt,
        isInMyWish: saved,
        savedWishId,
      })),
    },
  };
};

export const recentWishesInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: QUERY_KEYS.EXPLORE.RECENT,
  queryFn: ({ pageParam }) => getRecentWishes(pageParam),
  initialPageParam: null as string | null,
  getNextPageParam: page => (page.pageResponse.hasNext ? page.pageResponse.nextCursor : null),
});
