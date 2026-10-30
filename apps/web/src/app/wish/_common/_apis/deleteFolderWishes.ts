import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { DeleteFolderWishesRequestT, DeleteFolderWishesResponseT } from '@/types/folder';

export const deleteFolderWishes = async (folderId: number, body: DeleteFolderWishesRequestT) => {
  const { data } = await clientApi.delete<ApiResponseT<DeleteFolderWishesResponseT>>(
    ENDPOINTS.FOLDER_WISHES(folderId),
    { data: body }
  );

  return data.data;
};
