import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { PostFolderRequestT, PostFolderResponseT } from '@/types/folder';

export const postFolder = async (body: PostFolderRequestT) => {
  const { data } = await clientApi.post<ApiResponseT<PostFolderResponseT>>(
    ENDPOINTS.FOLDERS,
    body
  );

  return data.data;
};
