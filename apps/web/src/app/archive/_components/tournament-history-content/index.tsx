import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getTournamentList } from '@/apis/getTournamentList';
import { getQueryClient } from '@/utils/queryClient';

import TournamentHistoryContentClient from './client';

async function TournamentHistoryContent() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['tournamentList', []],
    queryFn: () => getTournamentList(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TournamentHistoryContentClient />
    </HydrationBoundary>
  );
}

export default TournamentHistoryContent;
