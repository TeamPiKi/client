import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type {
  PostTournamentItemImagesRequestT,
  PostTournamentItemImagesResponseT,
} from '@/types/tournament';

import { clientApi } from './client';

/** 업로드를 마친 이미지(imageKey)들로 토너먼트 아이템 등록 확정 */
export const postTournamentItemImages = async (
  tournamentId: number,
  body: PostTournamentItemImagesRequestT
) => {
  const { data } = await clientApi.post<ApiResponseT<PostTournamentItemImagesResponseT>>(
    ENDPOINTS.TOURNAMENT_ITEM_IMAGE_CONFIRM(tournamentId),
    body
  );

  return data.data;
};
