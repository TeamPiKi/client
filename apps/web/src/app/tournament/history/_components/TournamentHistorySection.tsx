'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import Spacing from '@/components/spacing';
import { Z_INDEX } from '@/consts/zIndex';
import { replaceUrlKeepingState } from '@/utils/replaceUrlKeepingState';

import { PLAY_TYPE_BY_FILTER, PLAY_TYPE_FILTER } from '../_consts/tournamentPlayType';
import { STATUS_BY_TAB } from '../_consts/tournamentTab';
import type { TournamentPlayTypeFilterT } from '../_types/tournamentPlayType';
import type { TournamentStatusTabT } from '../_types/tournamentTab';
import { parsePlayParam, parseTabParam } from '../_utils/tournamentSearchParams';
import TournamentHistoryList from './TournamentHistoryList';
import TournamentHistorySkeleton from './TournamentHistorySkeleton';
import TournamentPlayTypeFilter from './TournamentPlayTypeFilter';
import TournamentStatusTab from './TournamentStatusTab';

function TournamentHistorySection() {
  const searchParams = useSearchParams();
  const activeTab = parseTabParam(searchParams.get('tab'));
  const activePlayTypeFilter = parsePlayParam(searchParams.get('play'));

  const syncSearchParams = (tab: TournamentStatusTabT, play: TournamentPlayTypeFilterT) => {
    replaceUrlKeepingState(`?tab=${tab}&play=${play}`);
  };

  /** 탭을 옮기면 플레이 유형 필터는 항상 '전체'로 초기화 */
  const handleTabChange = (tab: TournamentStatusTabT) => {
    syncSearchParams(tab, PLAY_TYPE_FILTER.ALL);
  };

  const handlePlayTypeFilterChange = (play: TournamentPlayTypeFilterT) => {
    syncSearchParams(activeTab, play);
  };

  return (
    <>
      <div
        className="sticky top-0 flex w-full flex-col bg-bg-layer-basement pt-padding-top pb-2"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        <h1 className="heading-1-bold text-text-neutral-primary">내 토너먼트</h1>
        <Spacing size={16} />
        <TournamentStatusTab activeTab={activeTab} onTabChange={handleTabChange} />
        <Spacing size={24} />
        <TournamentPlayTypeFilter
          activeFilter={activePlayTypeFilter}
          onFilterChange={handlePlayTypeFilterChange}
        />
      </div>
      <div className="hide-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pt-4 pb-46">
        <Suspense
          key={`${activeTab}-${activePlayTypeFilter}`}
          fallback={<TournamentHistorySkeleton />}
        >
          <TournamentHistoryList
            statuses={STATUS_BY_TAB[activeTab]}
            playType={PLAY_TYPE_BY_FILTER[activePlayTypeFilter]}
            statusTab={activeTab}
          />
        </Suspense>
      </div>
    </>
  );
}

export default TournamentHistorySection;
