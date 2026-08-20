import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { PostWishPresignedUrlRequestT, PostWishPresignedUrlResponseT } from '@/types/wish';

import { clientApi } from './client';

/** 위시 이미지 업로드용 presigned URL 발급 */
export const postWishPresignedUrl = async (body: PostWishPresignedUrlRequestT) => {
  const { data } = await clientApi.post<ApiResponseT<PostWishPresignedUrlResponseT>>(
    ENDPOINTS.WISH_IMAGE_PRESIGNED,
    body
  );

  return data.data;
};
