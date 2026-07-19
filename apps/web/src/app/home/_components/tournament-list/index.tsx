import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getTournamentList } from '@/apis/getTournamentList';
import type { TournamentStatusT } from '@/types/tournament';
import { getQueryClient } from '@/utils/queryClient';

import TournamentListClient from './client';

const TOURNAMENT_LIST_STATUS: TournamentStatusT[] = ['PENDING', 'IN_PROGRESS'];

function TournamentList() {
  const queryClient = getQueryClient();

  // await 하지 않음 — pending dehydrate 스트리밍. 홈 재방문 시 클라 캐시로 즉시 렌더
  void queryClient.prefetchQuery({
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
