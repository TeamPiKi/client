import { environmentManager, queryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';

import type { GetProfileResponseT } from '../_types/profile';

export const getProfile = async (userId: string) => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<ApiResponseT<GetProfileResponseT>>(ENDPOINTS.PROFILE(userId));

  return data.data;
};

export const profileQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.PROFILE.DETAIL(userId),
    queryFn: () => getProfile(userId),
  });
