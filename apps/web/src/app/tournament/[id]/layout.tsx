import { ERROR_CODE } from '@piki/core';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound, redirect } from 'next/navigation';

import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { getApiErrorCode, isGlobalNetError } from '@/utils/apiError';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import { getTournament } from './_common/_apis/getTournament';

type TournamentLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

async function TournamentLayout({ children, params }: TournamentLayoutProps) {
  const { id } = await params;
  const tournamentId = parseIdParam(id);
  const queryClient = getQueryClient();

  if (tournamentId === null) notFound();

  /** 토너먼트 접근 권한 조회 */
  try {
    const tournamentData = await getTournament(tournamentId);
    queryClient.setQueryData(['tournament', tournamentId], tournamentData);
  } catch (error) {
    if (isGlobalNetError(error)) throw error;

    const code = getApiErrorCode(error);

    /** 진입 자체가 막힌 경우라 화면에 안내할 자리가 없다 — 홈으로 보내고 쿼리로 토스트를 넘긴다 */
    if (code === ERROR_CODE.TOURNAMENT_FORBIDDEN)
      redirect(`${ROUTES.HOME}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.TOURNAMENT_FORBIDDEN}`);
    // else if (error.response?.status === 404) notFound(); // TODO: 아직 미정

    throw error;
  }

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default TournamentLayout;
