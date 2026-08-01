import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

export const patchTournamentItem = async (
  tournamentId: number,
  tournamentItemId: number,
  formData: FormData
) => {
  await clientApi.patch<ApiResponseT<null>>(
    ENDPOINTS.TOURNAMENT_ITEM(tournamentId, tournamentItemId),
    formData
  );
};
