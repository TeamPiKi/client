import { environmentManager } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

import type { GetWishResponseT } from '../_types/wish';

export const getWish = async (wishId: number) => {
  if (environmentManager.isServer()) {
    const { data } = await serverApi.get<ApiResponseT<GetWishResponseT>>(
      ENDPOINTS.WISHLIST(wishId)
    );
    return data.data;
  }

  const { data } = await clientApi.get<ApiResponseT<GetWishResponseT>>(ENDPOINTS.WISHLIST(wishId));
  return data.data;
};
