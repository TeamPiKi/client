import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { getQueryClient } from '@/utils/queryClient';

import { parseTournamentId } from '../../_common/_utils/parseTournamentId';
import { getGroupResult } from '../_apis/getGroupResult';
import GroupResultClient from './_components/GroupResultClient';

type GroupResultPageProps = {
  params: Promise<{ id: string }>;
};

async function GroupResultPage({ params }: GroupResultPageProps) {
  const { id } = await params;
  const tournamentId = parseTournamentId(id);

  if (tournamentId === null) notFound();

  const queryClient = getQueryClient();
  // await 하지 않음 — pending 상태로 dehydrate 되어 스트리밍되므로 전환이 블로킹되지 않는다.
  // prefetch 실패(친구 0명/권한 없음 등)는 클라이언트 useQuery 가 에러 분기로 자체 안내한다.
  void queryClient.prefetchQuery({
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
