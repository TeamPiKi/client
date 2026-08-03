'use client';

import { Suspense, useState } from 'react';

import Spacing from '@/components/spacing';

import { STATUS_BY_TAB, type TournamentStatusTabT } from '../_consts/tournamentTab';
import TournamentHistoryList from './TournamentHistoryList';
import TournamentHistorySkeleton from './TournamentHistorySkeleton';
import TournamentStatusTab from './TournamentStatusTab';

type Props = {
  initialTab: TournamentStatusTabT;
};

function TournamentHistorySection({ initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<TournamentStatusTabT>(initialTab);

  /** 서버 왕복 없이 주소만 동기화 */
  const handleTabChange = (tab: TournamentStatusTabT) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `?tab=${tab}`);
  };

  return (
    <>
      <div className="sticky top-0 z-20 flex w-full flex-col bg-bg-layer-basement pt-padding-top">
        <h1 className="heading-1-bold text-text-neutral-primary">내 토너먼트</h1>
        <Spacing size={16} />
        <TournamentStatusTab activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      <div className="hide-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pt-6 pb-24">
        <Suspense key={activeTab} fallback={<TournamentHistorySkeleton />}>
          <TournamentHistoryList statuses={STATUS_BY_TAB[activeTab]} />
        </Suspense>
      </div>
    </>
  );
}

export default TournamentHistorySection;
