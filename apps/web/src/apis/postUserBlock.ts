import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

export const postUserBlock = async (userId: string) => {
  const { data } = await clientApi.post<ApiResponseT<null>>(ENDPOINTS.BLOCK(userId));
  return data.data;
};
