import { environmentManager, infiniteQueryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { GetWishesRequestT, GetWishlistResponseT } from '@/types/wish';

export const getWishes = async (request: GetWishesRequestT, cursor: string | null = null) => {
  const params = { size: 20, ...request, ...(cursor ? { cursor } : {}) };
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<ApiResponseT<GetWishlistResponseT[]>>(ENDPOINTS.WISHLISTS, {
    params,
  });

  return data;
};

export const wishesInfiniteQueryOptions = (request: GetWishesRequestT = {}) =>
  infiniteQueryOptions({
    queryKey: ['wishlists', request],
    queryFn: ({ pageParam }) => getWishes(request, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: page => (page.pageResponse.hasNext ? page.pageResponse.nextCursor : null),
  });
