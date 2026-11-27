import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { QUERY_KEYS } from '@/consts/queryKeys';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import { getExploreWish } from './_apis/getExploreWish';

type ExploreWishLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ wishId: string }>;
};

async function ExploreWishLayout({ children, params }: ExploreWishLayoutProps) {
  const wishId = parseIdParam((await params).wishId);
  if (!wishId) notFound();

  const exploreWishData = await getExploreWish(wishId);
  if (!exploreWishData) notFound();

  const queryClient = getQueryClient();
  queryClient.setQueryData(QUERY_KEYS.EXPLORE.WISH(wishId), exploreWishData);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

export default ExploreWishLayout;
