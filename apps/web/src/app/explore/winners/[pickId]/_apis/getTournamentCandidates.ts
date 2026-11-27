import { environmentManager, queryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';
import { getApiErrorStatus } from '@/utils/apiError';

import type { ExplorePickCandidatesT } from '../../../_common/_types/explore';
import type { GetTournamentCandidatesResponseT } from '../_types/candidate';

/** 볼 수 없는 1위는 서버가 404 로 응답하므로 null 로 바꿔 볼 수 없는 화면으로 보냄 */
export const getTournamentCandidates = async (
  pickId: number
): Promise<ExplorePickCandidatesT | null> => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  try {
    const { data } = await api.get<ApiResponseT<GetTournamentCandidatesResponseT>>(
      ENDPOINTS.EXPLORE_PICK_CANDIDATES(pickId)
    );
    const { tournament, candidates } = data.data;

    return {
      pickId,
      tournament: { id: tournament.tournamentId, title: tournament.name },
      candidates: candidates.map(({ candidateId, isPick, saved, item }) => ({
        candidateId,
        item,
        isWinner: isPick,
        isInMyWish: saved,
      })),
    };
  } catch (error) {
    if (getApiErrorStatus(error) === 404) return null;
    throw error;
  }
};

export const tournamentCandidatesQueryOptions = (pickId: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.EXPLORE.CANDIDATES(pickId),
    queryFn: () => getTournamentCandidates(pickId),
  });
