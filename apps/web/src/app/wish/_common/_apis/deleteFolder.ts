import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';

export const deleteFolder = async (folderId: number) => {
  await clientApi.delete(ENDPOINTS.FOLDER(folderId));
};
