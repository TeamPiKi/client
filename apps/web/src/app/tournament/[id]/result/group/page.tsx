import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

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
  // 진입 카드를 isRoot 만으로 노출하기 때문에 친구 0명/권한 없음 등으로 실패할 수 있다.
  // prefetch 가 실패해도 페이지는 그대로 보여주고, 클라이언트가 useQuery 에러 분기로 안내한다.
  try {
    await queryClient.prefetchQuery({
      queryKey: ['groupResult', tournamentId],
      queryFn: () => getGroupResult(tournamentId),
    });
  } catch {
    // 무시 — 클라이언트가 에러 상태로 자체 안내
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupResultClient tournamentId={tournamentId} />
    </HydrationBoundary>
  );
}

export default GroupResultPage;
