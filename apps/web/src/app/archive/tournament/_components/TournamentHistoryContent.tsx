import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';

import { getTournamentList } from '@/apis/getTournamentList';
import Spacing from '@/components/spacing';
import { getQueryClient } from '@/utils/queryClient';

import { STATUS_BY_TAB, type TournamentStatusTabT } from '../_consts/tournamentTab';
import TournamentHistoryList from './TournamentHistoryList';
import TournamentStatusTab from './TournamentStatusTab';

type Props = {
  activeTab: TournamentStatusTabT;
};

async function TournamentHistoryContent({ activeTab }: Props) {
  const statuses = STATUS_BY_TAB[activeTab];
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['tournamentList', statuses],
    queryFn: () => getTournamentList(statuses),
  });

  return (
    <>
      <div className="sticky top-0 z-20 flex w-full flex-col bg-bg-layer-basement pt-padding-top">
        <h1 className="heading-1 text-text-neutral-primary">내 토너먼트</h1>
        <Spacing size={16} />
        <TournamentStatusTab activeTab={activeTab} />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <main className="flex flex-1 flex-col items-center justify-center pb-24">
              <p className="body-1-semibold text-text-neutral-tertiary">
                토너먼트를 불러오는 중이에요
              </p>
            </main>
          }
        >
          <TournamentHistoryList key={activeTab} statuses={statuses} />
        </Suspense>
      </HydrationBoundary>
    </>
  );
}

export default TournamentHistoryContent;
