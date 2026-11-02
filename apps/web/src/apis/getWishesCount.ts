import { environmentManager, queryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { GetWishesCountResponseT, GetWishesRequestT } from '@/types/wish';

export const getWishesCount = async (request: GetWishesRequestT) => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<ApiResponseT<GetWishesCountResponseT>>(ENDPOINTS.WISHLISTS_COUNT, {
    params: request,
  });

  return data.data.count;
};

export const wishesCountQueryOptions = (request: GetWishesRequestT = {}) =>
  queryOptions({
    queryKey: ['wishlists', 'count', request],
    queryFn: () => getWishesCount(request),
  });
