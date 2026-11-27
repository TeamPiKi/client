import { useSuspenseQuery } from '@tanstack/react-query';

import { tournamentCandidatesQueryOptions } from '../_apis/getTournamentCandidates';

export const useGetTournamentCandidates = (pickId: number) => {
  const { data: tournamentCandidatesData } = useSuspenseQuery(
    tournamentCandidatesQueryOptions(pickId)
  );

  return { tournamentCandidatesData };
};
