import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { QUERY_KEYS } from '@/consts/queryKeys';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import ExploreDetailFrame from '../../_common/_components/ExploreDetailFrame';
import { getExploreWish } from './_apis/getExploreWish';
import ExploreWishContent from './_components/ExploreWishContent';

type ExploreWishPageProps = {
  params: Promise<{ wishId: string }>;
};

/** 조회가 끝날 때까지 같은 경로의 loading.tsx 가 화면 틀과 스켈레톤을 먼저 보여줌 */
async function ExploreWishPage({ params }: ExploreWishPageProps) {
  const wishId = parseIdParam((await params).wishId);
  if (!wishId) notFound();

  const exploreWishData = await getExploreWish(wishId);
  if (!exploreWishData) notFound();

  const queryClient = getQueryClient();
  queryClient.setQueryData(QUERY_KEYS.EXPLORE.WISH(wishId), exploreWishData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExploreDetailFrame>
        <ExploreWishContent wishId={wishId} />
      </ExploreDetailFrame>
    </HydrationBoundary>
  );
}

export default ExploreWishPage;
