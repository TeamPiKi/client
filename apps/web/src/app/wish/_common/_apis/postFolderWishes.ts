import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { PostFolderWishesRequestT, PostFolderWishesResponseT } from '@/types/folder';

export const postFolderWishes = async (folderId: number, body: PostFolderWishesRequestT) => {
  const { data } = await clientApi.post<ApiResponseT<PostFolderWishesResponseT>>(
    ENDPOINTS.FOLDER_WISHES(folderId),
    body
  );

  return data.data;
};
