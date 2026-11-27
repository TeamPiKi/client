import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { QUERY_KEYS } from '@/consts/queryKeys';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import { getTournamentCandidates } from './_apis/getTournamentCandidates';

type TournamentCandidatesLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ pickId: string }>;
};

async function TournamentCandidatesLayout({ children, params }: TournamentCandidatesLayoutProps) {
  const pickId = parseIdParam((await params).pickId);
  if (!pickId) notFound();

  const tournamentCandidatesData = await getTournamentCandidates(pickId);
  if (!tournamentCandidatesData) notFound();

  const queryClient = getQueryClient();
  queryClient.setQueryData(QUERY_KEYS.EXPLORE.CANDIDATES(pickId), tournamentCandidatesData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default TournamentCandidatesLayout;
