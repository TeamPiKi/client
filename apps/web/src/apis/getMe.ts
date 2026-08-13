import { environmentManager, queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';
import type { UserT } from '@/types/user';

import { clientApi } from './client';
import { serverApi } from './server';

export const getMe = async () => {
  if (environmentManager.isServer()) {
    const { data } = await serverApi.get<ApiResponseT<UserT>>('/api/v1/users/me');

    return data.data;
  }

  const { data } = await clientApi.get<ApiResponseT<UserT>>('/api/v1/users/me');
  return data.data;
};

export const getMeQueryOptions = queryOptions({
  queryKey: QUERY_KEYS.USER.ME,
  queryFn: getMe,
  staleTime: 5 * 60 * 1000,
});
