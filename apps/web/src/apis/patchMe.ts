import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { UserT } from '@/types/user';

import { clientApi } from './client';

export const patchMe = async (formData: FormData) => {
  const { data } = await clientApi.patch<ApiResponseT<UserT>>(ENDPOINTS.USER, formData);

  return data.data;
};
