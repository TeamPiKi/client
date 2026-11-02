import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { PostFolderWishesMoveRequestT, PostFolderWishesMoveResponseT } from '@/types/folder';

export const postFolderWishesMove = async (
  folderId: number,
  body: PostFolderWishesMoveRequestT
) => {
  const { data } = await clientApi.post<ApiResponseT<PostFolderWishesMoveResponseT>>(
    ENDPOINTS.FOLDER_WISHES_MOVE(folderId),
    body
  );

  return data.data;
};
