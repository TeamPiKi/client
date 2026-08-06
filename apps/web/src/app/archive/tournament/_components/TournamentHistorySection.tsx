'use client';

import { Suspense, useState } from 'react';

import Spacing from '@/components/spacing';

import {
  PLAY_TYPE_BY_FILTER,
  PLAY_TYPE_FILTER,
  type TournamentPlayTypeFilterT,
} from '../_consts/tournamentPlayType';
import { STATUS_BY_TAB, type TournamentStatusTabT } from '../_consts/tournamentTab';
import TournamentHistoryList from './TournamentHistoryList';
import TournamentHistorySkeleton from './TournamentHistorySkeleton';
import TournamentPlayTypeFilter from './TournamentPlayTypeFilter';
import TournamentStatusTab from './TournamentStatusTab';

type Props = {
  initialTab: TournamentStatusTabT;
  initialPlayTypeFilter: TournamentPlayTypeFilterT;
};

function TournamentHistorySection({ initialTab, initialPlayTypeFilter }: Props) {
  const [activeTab, setActiveTab] = useState<TournamentStatusTabT>(initialTab);
  const [activePlayTypeFilter, setActivePlayTypeFilter] =
    useState<TournamentPlayTypeFilterT>(initialPlayTypeFilter);

  /** 서버 왕복 없이 주소만 동기화 */
  const syncSearchParams = (tab: TournamentStatusTabT, play: TournamentPlayTypeFilterT) => {
    window.history.replaceState(null, '', `?tab=${tab}&play=${play}`);
  };

  const handleTabChange = (tab: TournamentStatusTabT) => {
    setActiveTab(tab);

    /** 탭을 옮기면 플레이 유형 필터는 항상 '전체'로 초기화 */
    setActivePlayTypeFilter(PLAY_TYPE_FILTER.ALL);
    syncSearchParams(tab, PLAY_TYPE_FILTER.ALL);
  };

  const handlePlayTypeFilterChange = (play: TournamentPlayTypeFilterT) => {
    setActivePlayTypeFilter(play);
    syncSearchParams(activeTab, play);
  };

  return (
    <>
      <div className="sticky top-0 z-20 flex w-full flex-col bg-bg-layer-basement pt-padding-top">
        <h1 className="heading-1-bold text-text-neutral-primary">내 토너먼트</h1>
        <Spacing size={16} />
        <TournamentStatusTab activeTab={activeTab} onTabChange={handleTabChange} />
        <Spacing size={24} />
        <TournamentPlayTypeFilter
          activeFilter={activePlayTypeFilter}
          onFilterChange={handlePlayTypeFilterChange}
        />
      </div>
      <div className="hide-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pt-6 pb-24">
        <Suspense
          key={`${activeTab}-${activePlayTypeFilter}`}
          fallback={<TournamentHistorySkeleton />}
        >
          <TournamentHistoryList
            statuses={STATUS_BY_TAB[activeTab]}
            playType={PLAY_TYPE_BY_FILTER[activePlayTypeFilter]}
          />
        </Suspense>
      </div>
    </>
  );
}

export default TournamentHistorySection;
