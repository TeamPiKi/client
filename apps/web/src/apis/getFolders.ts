import { environmentManager, queryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { GetFoldersResponseT } from '@/types/folder';

export const getFolders = async () => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<ApiResponseT<GetFoldersResponseT>>(ENDPOINTS.FOLDERS);

  return data.data;
};

export const foldersQueryOptions = queryOptions({
  queryKey: ['folders'],
  queryFn: getFolders,
});
