import { environmentManager, queryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';

import type { GetFriendsResponseT } from '../_types/friend';

export const getFriends = async () => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<ApiResponseT<GetFriendsResponseT>>(ENDPOINTS.FRIENDS);

  return data.data;
};

export const friendsQueryOptions = queryOptions({
  queryKey: QUERY_KEYS.FRIEND.LIST,
  queryFn: getFriends,
});
