import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

import type { PostExploreWishResponseT } from '../_types/explore';

export type PostExplorePickCandidateRequestT = {
  pickId: number;
  candidateId: number;
};

export const postExplorePickCandidate = async ({
  pickId,
  candidateId,
}: PostExplorePickCandidateRequestT) => {
  const { data } = await clientApi.post<ApiResponseT<PostExploreWishResponseT>>(
    ENDPOINTS.EXPLORE_PICK_CANDIDATE_COPY(pickId, candidateId)
  );

  return data.data;
};
