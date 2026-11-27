import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

import type { PostExploreWishResponseT } from '../_types/explore';

export const postExploreWish = async (wishId: number) => {
  const { data } = await clientApi.post<ApiResponseT<PostExploreWishResponseT>>(
    ENDPOINTS.EXPLORE_WISH_COPY(wishId)
  );

  return data.data;
};
