import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { DeleteFolderWishesRequestT, DeleteFolderWishesResponseT } from '@/types/folder';

export const deleteFolderWishes = async (folderId: number, request: DeleteFolderWishesRequestT) => {
  const params = new URLSearchParams();
  if ('all' in request) params.set('all', 'true');
  else request.wishIds.forEach(wishId => params.append('wishIds', String(wishId)));

  const { data } = await clientApi.delete<ApiResponseT<DeleteFolderWishesResponseT>>(
    `${ENDPOINTS.FOLDER_WISHES(folderId)}?${params}`
  );

  return data.data;
};
