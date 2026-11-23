import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { QUERY_KEYS } from '@/consts/queryKeys';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import { getTournamentCandidates } from './_apis/getTournamentCandidates';

type TournamentCandidatesLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ tournamentId: string }>;
};

async function TournamentCandidatesLayout({ children, params }: TournamentCandidatesLayoutProps) {
  const tournamentId = parseIdParam((await params).tournamentId);
  if (!tournamentId) notFound();

  /** TODO: API 연동 시 404 응답을 받아 분기 */
  const tournamentCandidatesData = await getTournamentCandidates(tournamentId);
  if (!tournamentCandidatesData) notFound();

  const queryClient = getQueryClient();
  queryClient.setQueryData(QUERY_KEYS.EXPLORE.CANDIDATES(tournamentId), tournamentCandidatesData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default TournamentCandidatesLayout;
