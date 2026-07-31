import { useSuspenseQuery } from '@tanstack/react-query';

import { getTournamentList } from '@/apis/getTournamentList';
import type { GetTournamentListRequestT } from '@/types/tournament';

export const useGetTournamentList = (params: GetTournamentListRequestT = {}) => {
  const { data: tournamentListData } = useSuspenseQuery({
    queryKey: ['tournamentList', params],
    queryFn: () => getTournamentList(params),
  });

  return { tournamentListData };
};
