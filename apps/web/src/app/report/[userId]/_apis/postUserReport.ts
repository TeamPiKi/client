import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

import type { PostUserReportRequestT, PostUserReportResponseT } from '../_types/report';

export const postUserReport = async (userId: string, body: PostUserReportRequestT) => {
  const { data } = await clientApi.post<ApiResponseT<PostUserReportResponseT>>(
    ENDPOINTS.USER_REPORT(userId),
    body
  );
  return data.data;
};
