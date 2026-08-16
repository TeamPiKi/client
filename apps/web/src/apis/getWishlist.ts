import { environmentManager, infiniteQueryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { GetWishlistResponseT } from '@/types/wish';

export const getWishlist = async (cursor: string | null = null) => {
  const params = { size: 20, ...(cursor ? { cursor } : {}) };

  if (environmentManager.isServer()) {
    const { data } = await serverApi.get<ApiResponseT<GetWishlistResponseT[]>>(
      ENDPOINTS.WISHLISTS,
      {
        params,
      }
    );
    return data;
  }

  const { data } = await clientApi.get<ApiResponseT<GetWishlistResponseT[]>>(ENDPOINTS.WISHLISTS, {
    params,
  });
  return data;
};

/** 서버 prefetch·suspense 훅·일반 구독이 모두 같은 캐시를 바라봐야 하므로 설정을 한곳에서 관리 */
export const wishlistInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: ['wishlists'],
  queryFn: ({ pageParam }) => getWishlist(pageParam),
  initialPageParam: null as string | null,
  getNextPageParam: page => (page.pageResponse.hasNext ? page.pageResponse.nextCursor : null),
});
