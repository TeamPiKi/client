import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { QUERY_KEYS } from '@/consts/queryKeys';
import { parseIdParam } from '@/utils/parseIdParam';
import { getQueryClient } from '@/utils/queryClient';

import ExploreDetailFrame from '../../_common/_components/ExploreDetailFrame';
import { getExplorePick } from './_apis/getExplorePick';
import ExplorePickContent from './_components/ExplorePickContent';

type ExplorePickPageProps = {
  params: Promise<{ pickId: string }>;
};

/** 조회가 끝날 때까지 같은 경로의 loading.tsx 가 화면 틀과 스켈레톤을 먼저 보여줌 */
async function ExplorePickPage({ params }: ExplorePickPageProps) {
  const pickId = parseIdParam((await params).pickId);
  if (!pickId) notFound();

  const explorePickData = await getExplorePick(pickId);
  if (!explorePickData) notFound();

  const queryClient = getQueryClient();
  queryClient.setQueryData(QUERY_KEYS.EXPLORE.PICK(pickId), explorePickData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExploreDetailFrame>
        <ExplorePickContent pickId={pickId} />
      </ExploreDetailFrame>
    </HydrationBoundary>
  );
}

export default ExplorePickPage;
