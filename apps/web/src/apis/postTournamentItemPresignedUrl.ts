import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type {
  PostTournamentItemPresignedUrlRequestT,
  PostTournamentItemPresignedUrlResponseT,
} from '@/types/tournament';

import { clientApi } from './client';

/** 토너먼트 아이템 이미지 업로드용 presigned URL 발급 */
export const postTournamentItemPresignedUrl = async (
  tournamentId: number,
  body: PostTournamentItemPresignedUrlRequestT
) => {
  const { data } = await clientApi.post<ApiResponseT<PostTournamentItemPresignedUrlResponseT>>(
    ENDPOINTS.TOURNAMENT_ITEM_IMAGE_PRESIGNED(tournamentId),
    body
  );

  return data.data;
};
