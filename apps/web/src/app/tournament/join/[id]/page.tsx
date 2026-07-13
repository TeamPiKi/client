import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { getMe } from '@/apis/getMe';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import { getInvitePreview } from '../_apis/getInvitePreview';
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

  const queryClient = getQueryClient();
  const getInvitePreviewPromise = queryClient.prefetchQuery({
    queryKey: ['invitePreview', tournamentId],
    queryFn: () => getInvitePreview(tournamentId),
  });

  const getMePromise = queryClient.prefetchQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  await Promise.all([getInvitePreviewPromise, getMePromise]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JoinPreviewClient tournamentId={tournamentId} inviteCode={code ?? ''} />
    </HydrationBoundary>
  );
}

export default TournamentJoinPage;
