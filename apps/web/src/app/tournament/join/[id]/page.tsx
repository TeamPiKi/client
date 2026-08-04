import { ERROR_CODE } from '@piki/core';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { getInvitePreviewByCode } from '@/apis/getInvitePreviewByCode';
import { getMe } from '@/apis/getMe';
import { ROUTES } from '@/consts/route';
import { getApiErrorCode, getApiErrorStatus, isServerOrNetworkError } from '@/utils/apiError';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import JoinErrorScreen from './_components/JoinErrorScreen';
import JoinPreviewClient from './_components/JoinPreviewClient';

type TournamentJoinPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ code?: string }>;
};

/** iOS Smart Banner 용 metadata 생성 */
export async function generateMetadata({
  params,
  searchParams,
}: TournamentJoinPageProps): Promise<Metadata> {
  const appStoreId = process.env.NEXT_PUBLIC_IOS_APP_STORE_ID;
  if (!appStoreId) return {};

  const headerStore = await headers();
  const host = headerStore.get('host');
  if (!host) return { itunes: { appId: appStoreId } };

  const { id } = await params;
  const { code } = await searchParams;
  const appArgument = `https://${host}/tournament/join/${id}${code ? `?code=${code}` : ''}`;

  return {
    itunes: { appId: appStoreId, appArgument },
  };
}

async function TournamentJoinPage({ params, searchParams }: TournamentJoinPageProps) {
  const { id } = await params;
  const { code } = await searchParams;
  const tournamentId = parseIdParam(id);

  if (tournamentId === null) notFound();

  /** 초대 코드가 없는 경우 */
  if (!code) return <JoinErrorScreen type="INVALID_CODE" />;

  let preview;
  try {
    preview = await getInvitePreviewByCode(code);
  } catch (error) {
    if (isServerOrNetworkError(error)) throw error;

    if (getApiErrorStatus(error) === 409) {
      const apiErrorCode = getApiErrorCode(error);

      /** 토너먼트 이미 시작한 경우 */
      /** TODO: `TOURNAMENT-005` 가 진행 중·완료를 한 코드로 덮어 완료된 토너먼트에도 "이미 시작된" 안내가 나간다 . 서버 수정 후 변경 필요 */
      if (apiErrorCode === ERROR_CODE.TOURNAMENT_NOT_PENDING)
        return <JoinErrorScreen type="ALREADY_STARTED" />;

      /** 초대 링크 만료된 경우 */
      if (apiErrorCode === ERROR_CODE.TOURNAMENT_INVITE_EXPIRED)
        return <JoinErrorScreen type="LINK_EXPIRED" />;
    }

    return <JoinErrorScreen type="INVALID_CODE" />;
  }

  /** 코드의 토너먼트가 URL path 와 다르면 잘못된 링크 */
  if (preview.tournamentId !== tournamentId) return <JoinErrorScreen type="INVALID_CODE" />;

  /** 이미 참여한 유저인 경우 - 바로 토너먼트 준비 화면으로 진입 */
  if (preview.joined) redirect(ROUTES.TOURNAMENT_CREATE(tournamentId));

  const queryClient = getQueryClient();
  queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JoinPreviewClient tournamentId={tournamentId} inviteCode={code} preview={preview} />
    </HydrationBoundary>
  );
}

export default TournamentJoinPage;
