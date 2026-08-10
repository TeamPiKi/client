import { environmentManager } from '@tanstack/react-query';

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
