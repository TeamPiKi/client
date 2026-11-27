import { environmentManager, queryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';

import type { GetUserBlocksResponseT } from '../_types/friend';

export const getUserBlocks = async () => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<ApiResponseT<GetUserBlocksResponseT>>(ENDPOINTS.BLOCKS);

  return data.data;
};

export const userBlocksQueryOptions = queryOptions({
  queryKey: QUERY_KEYS.FRIEND.BLOCKED,
  queryFn: getUserBlocks,
});
