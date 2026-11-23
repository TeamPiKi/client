import { useSuspenseQuery } from '@tanstack/react-query';

import { tournamentCandidatesQueryOptions } from '../_apis/getTournamentCandidates';

export const useGetTournamentCandidates = (tournamentId: number) => {
  const { data: tournamentCandidatesData } = useSuspenseQuery(
    tournamentCandidatesQueryOptions(tournamentId)
  );

  return { tournamentCandidatesData };
};
