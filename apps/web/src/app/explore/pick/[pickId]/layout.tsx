import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { QUERY_KEYS } from '@/consts/queryKeys';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import { getExplorePick } from './_apis/getExplorePick';

type ExplorePickLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ pickId: string }>;
};

async function ExplorePickLayout({ children, params }: ExplorePickLayoutProps) {
  const pickId = parseIdParam((await params).pickId);
  if (!pickId) notFound();

  const explorePickData = await getExplorePick(pickId);
  if (!explorePickData) notFound();

  const queryClient = getQueryClient();
  queryClient.setQueryData(QUERY_KEYS.EXPLORE.PICK(pickId), explorePickData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default ExplorePickLayout;
