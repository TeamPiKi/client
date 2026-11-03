import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

import type { PatchWishResponseT } from '../_types/wish';

export const patchWish = async (wishId: number, formData: FormData) => {
  const { data } = await clientApi.patch<ApiResponseT<PatchWishResponseT>>(
    ENDPOINTS.WISHLIST(wishId),
    formData
  );

  return data.data;
};
