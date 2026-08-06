import { useSuspenseQuery } from '@tanstack/react-query';

import { getTournamentList } from '@/apis/getTournamentList';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { GetTournamentListRequestT } from '@/types/tournament';

export const useGetTournamentList = (params: GetTournamentListRequestT) => {
  const { data: tournamentListData } = useSuspenseQuery({
    queryKey: QUERY_KEYS.TOURNAMENT.LIST.BY_PARAMS(params),
    queryFn: () => getTournamentList(params),
  });

  return { tournamentListData };
};
