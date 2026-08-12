import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { ROUTES } from '@/consts/route';
import { getIsApp } from '@/utils/getIsApp';
import { getIsGuest } from '@/utils/getIsGuest';
import { getQueryClient } from '@/utils/queryClient';

import { getTournament } from '../_common/_apis/getTournament';
import type { GetTournamentResponseT } from '../_common/_types/tournamentResponse';
import ResultClient from './_components/ResultClient';

type TournamentResultPageProps = {
  params: Promise<{ id: string }>;
};

async function TournamentResultPage({ params }: TournamentResultPageProps) {
  const { id } = await params;
  const tournamentId = Number(id);

  const queryClient = getQueryClient();
  // prefetchQuery 가 아닌 직접 fetch — 매치 결승 직후 시드(hasGroupResult=false 등)는
  // 결과 페이지에서는 권위 응답으로 반드시 덮어써야 한다.
  const tournamentData = await getTournament(tournamentId);
  queryClient.setQueryData<GetTournamentResponseT>(['tournament', tournamentId], tournamentData);

  if (tournamentData.status !== 'COMPLETED') {
    redirect(ROUTES.TOURNAMENT_MATCH(tournamentId));
  }

  const [isGuest, isApp] = await Promise.all([getIsGuest(), getIsApp()]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ResultClient tournamentId={tournamentId} isGuest={isGuest} isApp={isApp} />
    </HydrationBoundary>
  );
}

export default TournamentResultPage;
