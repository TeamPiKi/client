import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

export const postWishRefresh = async (wishId: number) => {
  const { data } = await clientApi.post<ApiResponseT<null>>(ENDPOINTS.WISHLIST_REFRESH(wishId));

  return data.data;
};
