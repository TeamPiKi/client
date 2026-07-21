import { Suspense } from 'react';

import BottomTabBar from '@/components/bottom-tab-bar';
import Spacing from '@/components/spacing';

import TournamentFab from './_components/TournamentFab';
import TournamentHistoryList from './_components/TournamentHistoryList';
import TournamentHistorySkeleton from './_components/TournamentHistorySkeleton';
import TournamentStatusTab from './_components/TournamentStatusTab';
import { STATUS_BY_TAB, type TournamentStatusTabT } from './_consts/tournamentTab';

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

async function ArchiveTournamentPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const activeTab: TournamentStatusTabT = tab === 'completed' ? 'completed' : 'ongoing';

  return (
    <div className="flex min-h-dvh flex-col bg-bg-layer-basement px-5">
      <div className="sticky top-0 z-20 flex w-full flex-col bg-bg-layer-basement pt-padding-top">
        <h1 className="heading-1 text-text-neutral-primary">내 토너먼트</h1>
        <Spacing size={16} />
        <TournamentStatusTab activeTab={activeTab} />
      </div>
      <Suspense key={activeTab} fallback={<TournamentHistorySkeleton />}>
        <TournamentHistoryList statuses={STATUS_BY_TAB[activeTab]} />
      </Suspense>
      <TournamentFab />
      <BottomTabBar />
    </div>
  );
}

export default ArchiveTournamentPage;
