import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { PostWishImagesRequestT, PostWishImagesResponseT } from '@/types/wish';

import { clientApi } from './client';

/** 업로드를 마친 이미지(imageKey)들로 위시 등록 확정 */
export const postWishImages = async (body: PostWishImagesRequestT) => {
  const { data } = await clientApi.post<ApiResponseT<PostWishImagesResponseT>>(
    ENDPOINTS.WISH_IMAGE_CONFIRM,
    body
  );

  return data.data;
};
