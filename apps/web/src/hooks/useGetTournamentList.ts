import { useSuspenseQuery } from '@tanstack/react-query';

import { getTournamentList } from '@/apis/getTournamentList';
import type { TournamentStatusT } from '@/types/tournament';

export const useGetTournamentList = (status: TournamentStatusT[] = [], limit?: number) => {
  const { data: tournamentListData } = useSuspenseQuery({
    queryKey: ['tournamentList', status, limit],
    queryFn: () => getTournamentList(status, limit),
  });

  return { tournamentListData };
};
