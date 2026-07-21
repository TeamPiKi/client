import { environmentManager } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { GetTournamentListResponseT, TournamentStatusT } from '@/types/tournament';

export const getTournamentList = async (status?: TournamentStatusT[], limit?: number) => {
  if (environmentManager.isServer()) {
    const { data } = await serverApi.get<ApiResponseT<GetTournamentListResponseT>>(
      ENDPOINTS.TOURNAMENTS,
      { params: { status, limit } }
    );

    return data.data;
  }

  const { data } = await clientApi.get<ApiResponseT<GetTournamentListResponseT>>(
    ENDPOINTS.TOURNAMENTS,
    { params: { status, limit } }
  );
  return data.data;
};
