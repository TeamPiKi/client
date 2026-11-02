import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { PatchFolderRequestT, PatchFolderResponseT } from '@/types/folder';

export const patchFolder = async (folderId: number, body: PatchFolderRequestT) => {
  const { data } = await clientApi.patch<ApiResponseT<PatchFolderResponseT>>(
    ENDPOINTS.FOLDER(folderId),
    body
  );

  return data.data;
};
