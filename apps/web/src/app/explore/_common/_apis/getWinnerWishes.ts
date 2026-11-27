import { environmentManager, infiniteQueryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';

import type { GetExplorePicksResponseT, WinnerWishT } from '../_types/explore';

export const getWinnerWishes = async (
  cursor: string | null = null
): Promise<ApiResponseT<WinnerWishT[]>> => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<ApiResponseT<GetExplorePicksResponseT>>(ENDPOINTS.EXPLORE_PICKS, {
    params: { size: 20, ...(cursor ? { cursor } : {}) },
  });

  return {
    ...data,
    data: data.data.picks.map(({ pickId, candidateId, saved, savedWishId, tournament, item }) => ({
      pickId,
      candidateId,
      item,
      tournament: { id: tournament.tournamentId, title: tournament.name },
      isInMyWish: saved,
      savedWishId,
    })),
  };
};

export const winnerWishesInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: QUERY_KEYS.EXPLORE.WINNERS,
  queryFn: ({ pageParam }) => getWinnerWishes(pageParam),
  initialPageParam: null as string | null,
  getNextPageParam: page => (page.pageResponse.hasNext ? page.pageResponse.nextCursor : null),
});
