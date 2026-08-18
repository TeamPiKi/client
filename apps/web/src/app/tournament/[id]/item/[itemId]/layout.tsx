import { ERROR_CODE } from '@piki/core';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound, redirect } from 'next/navigation';

import { getMe } from '@/apis/getMe';
import { QUERY_ACTION } from '@/consts/queryAction';
import { ROUTES } from '@/consts/route';
import { getApiErrorCode, getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import { getTournament } from '../../_common/_apis/getTournament';
import { getTournamentItem } from './_apis/getTournamentItem';
import { canEditTournamentItem } from './_utils/canEditTournamentItem';

type TournamentItemLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string; itemId: string }>;
};

async function TournamentItemLayout({ children, params }: TournamentItemLayoutProps) {
  const { id, itemId } = await params;

  const tournamentId = parseIdParam(id);
  const tournamentItemId = parseIdParam(itemId);

  if (!tournamentId || !tournamentItemId) notFound();

  const queryClient = getQueryClient();

  /** 토너먼트 아이템 접근 권한 조회 */
  try {
    const [tournamentItemData, tournamentData, userData] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ['tournamentItem', tournamentId, tournamentItemId],
        queryFn: () => getTournamentItem(tournamentId, tournamentItemId),
      }),
      queryClient.ensureQueryData({
        queryKey: ['tournament', tournamentId],
        queryFn: () => getTournament(tournamentId),
      }),
      queryClient.ensureQueryData({ queryKey: ['me'], queryFn: getMe }),
    ]);

    /** 아직 PROCESSING 상태인 경우에는 접근 불가 */
    if (tournamentItemData.status === 'PROCESSING' || tournamentItemData.status === 'PENDING')
      redirect(ROUTES.TOURNAMENT_CREATE(tournamentId));

    /** FAILED·INCOMPLETE 상태인 경우 주최자나 등록한 본인만 접근 가능 */
    if (
      (tournamentItemData.status === 'FAILED' || tournamentItemData.status === 'INCOMPLETE') &&
      !canEditTournamentItem(tournamentData, userData, tournamentItemId)
    )
      redirect(ROUTES.TOURNAMENT_CREATE(tournamentId));
  } catch (error) {
    if (isGlobalNetError(error)) throw error;

    const apiErrorCode = getApiErrorCode(error);
    const apiErrorStatus = getApiErrorStatus(error);

    /** 토너먼트 아이템이 존재하지 않는 경우 */
    if (apiErrorCode === ERROR_CODE.TOURNAMENT_NOT_FOUND_ITEM)
      redirect(
        `${ROUTES.TOURNAMENT_CREATE(tournamentId)}?${QUERY_ACTION.KEY}=${QUERY_ACTION.VALUE.TOURNAMENT_ITEM_NOT_FOUND}`
      );

    /** 토너먼트 아이템 접근 권한 없는 경우 */
    if (apiErrorStatus === 403) redirect(ROUTES.HOME);

    throw error;
  }

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default TournamentItemLayout;
