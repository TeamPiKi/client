import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

export const deleteWishes = async (wishIds: number[]) => {
  const { data } = await clientApi.delete<ApiResponseT<null>>(
    ENDPOINTS.WISHLISTS + `?ids=${wishIds.join(',')}`
  );
  return data.data;
};
