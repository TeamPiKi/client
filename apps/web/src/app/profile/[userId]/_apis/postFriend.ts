import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

export const postFriend = async (userId: string) => {
  const { data } = await clientApi.post<ApiResponseT<null>>(ENDPOINTS.FRIEND(userId));
  return data.data;
};
