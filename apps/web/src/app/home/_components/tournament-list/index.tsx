import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getTournamentList } from '@/apis/getTournamentList';
import type { TournamentStatusT } from '@/types/tournament';
import { getQueryClient } from '@/utils/queryClient';

import TournamentListClient from './client';

const TOURNAMENT_LIST_STATUS: TournamentStatusT[] = ['PENDING', 'IN_PROGRESS'];

async function TournamentList() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['tournamentList', TOURNAMENT_LIST_STATUS],
    queryFn: () => getTournamentList(TOURNAMENT_LIST_STATUS),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TournamentListClient statuses={TOURNAMENT_LIST_STATUS} />
    </HydrationBoundary>
  );
}

export default TournamentList;
