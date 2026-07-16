import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getTournamentList } from '@/apis/getTournamentList';
import type { TournamentStatusT } from '@/types/tournament';
import { getQueryClient } from '@/utils/queryClient';

import ArchiveTournamentClient from './ArchiveTournamentClient';

const DEFAULT_STATUSES: TournamentStatusT[] = ['PENDING', 'IN_PROGRESS'];

async function TournamentHistoryContent() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['tournamentList', DEFAULT_STATUSES],
    queryFn: () => getTournamentList(DEFAULT_STATUSES),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArchiveTournamentClient />
    </HydrationBoundary>
  );
}

export default TournamentHistoryContent;
