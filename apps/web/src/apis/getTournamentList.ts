import { environmentManager } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { GetTournamentListRequestT, GetTournamentListResponseT } from '@/types/tournament';

export const getTournamentList = async (params: GetTournamentListRequestT) => {
  if (environmentManager.isServer()) {
    const { data } = await serverApi.get<ApiResponseT<GetTournamentListResponseT>>(
      ENDPOINTS.TOURNAMENTS,
      { params }
    );

    return data.data;
  }

  const { data } = await clientApi.get<ApiResponseT<GetTournamentListResponseT>>(
    ENDPOINTS.TOURNAMENTS,
    { params }
  );
  return data.data;
};
