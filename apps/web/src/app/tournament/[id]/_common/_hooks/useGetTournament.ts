import { useSuspenseQuery } from '@tanstack/react-query';

import { getTournament } from '../_apis/getTournament';

export const useGetTournament = (tournamentId: number) => {
  const { data: tournamentData, refetch: refetchTournament } = useSuspenseQuery({
    queryKey: ['tournament', tournamentId],
    queryFn: () => getTournament(tournamentId),
  });

  return { tournamentData, refetchTournament };
};
