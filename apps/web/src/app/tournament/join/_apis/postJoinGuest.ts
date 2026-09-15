import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

import type { PostJoinGuestRequestT, PostJoinGuestResponseT } from '../_types/join';

type PostJoinGuestParamsT = {
  tournamentId: number;
  body: PostJoinGuestRequestT;
};

/** 무토큰 상태에서 참여하기 클릭 시 게스트 발급과 토너먼트 참여를 원자적으로 처리 */
export const postJoinGuest = async ({ tournamentId, body }: PostJoinGuestParamsT) => {
  const { data } = await clientApi.post<ApiResponseT<PostJoinGuestResponseT>>(
    ENDPOINTS.TOURNAMENT_JOIN_GUEST(tournamentId),
    body
  );

  return data.data;
};
