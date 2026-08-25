import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import { getTournament } from '../../_common/_apis/getTournament';
import { getGroupResult } from '../_apis/getGroupResult';
import GroupResultClient from './_components/GroupResultClient';

type GroupResultPageProps = {
  params: Promise<{ id: string }>;
};

async function GroupResultPage({ params }: GroupResultPageProps) {
  const { id } = await params;
  const tournamentId = parseIdParam(id);

  if (tournamentId === null) notFound();

  const queryClient = getQueryClient();

  // 그룹 결과는 원본(ROOT) 단위로 집계된다. CLONE 진입이면 원본 id 로 조회해야 해서 토너먼트를 먼저 확인한다.
  // (layout 과 병렬 렌더라 캐시 히트가 보장되지 않아 ensureQueryData 로 조회)
  const tournamentData = await queryClient.ensureQueryData({
    queryKey: ['tournament', tournamentId],
    queryFn: () => getTournament(tournamentId),
  });
  const groupResultTournamentId =
    'sourceTournamentId' in tournamentData && tournamentData.sourceTournamentId
      ? tournamentData.sourceTournamentId
      : tournamentId;

  queryClient.prefetchQuery({
    queryKey: ['groupResult', groupResultTournamentId],
    queryFn: () => getGroupResult(groupResultTournamentId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupResultClient tournamentId={tournamentId} />
    </HydrationBoundary>
  );
}

export default GroupResultPage;
