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
