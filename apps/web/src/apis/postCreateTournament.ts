import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type {
  PostCreateTournamentRequestT,
  PostCreateTournamentResponseT,
} from '@/types/tournament';

export const postCreateTournament = async (body: PostCreateTournamentRequestT) => {
  const { data } = await clientApi.post<ApiResponseT<PostCreateTournamentResponseT>>(
    ENDPOINTS.TOURNAMENTS,
    body
  );

  return data.data;
};
