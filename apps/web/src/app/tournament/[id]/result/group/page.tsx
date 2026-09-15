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

  // 클라이언트가 토너먼트 이름을 쓴다. layout 과 병렬 렌더라 캐시 히트가 보장되지 않아 여기서 확보한다.
  await queryClient.ensureQueryData({
    queryKey: ['tournament', tournamentId],
    queryFn: () => getTournament(tournamentId),
  });

  queryClient.prefetchQuery({
    queryKey: ['groupResult', tournamentId],
    queryFn: () => getGroupResult(tournamentId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupResultClient tournamentId={tournamentId} />
    </HydrationBoundary>
  );
}

export default GroupResultPage;
