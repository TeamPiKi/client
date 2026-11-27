import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { PatchFolderVisibilityRequestT, PatchFolderVisibilityResponseT } from '@/types/folder';

export const patchFolderVisibility = async (
  folderId: number,
  body: PatchFolderVisibilityRequestT
) => {
  const { data } = await clientApi.patch<ApiResponseT<PatchFolderVisibilityResponseT>>(
    ENDPOINTS.FOLDER_VISIBILITY(folderId),
    body
  );

  return data.data;
};
