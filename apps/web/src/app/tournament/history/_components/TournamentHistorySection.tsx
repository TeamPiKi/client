'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import CollapsibleTitle from '@/components/common/collapsible-title';
import PullToRefresh from '@/components/common/pull-to-refresh';
import UnderlineTab from '@/components/common/underline-tab';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { Z_INDEX } from '@/consts/zIndex';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { replaceUrlKeepingState } from '@/utils/replaceUrlKeepingState';

import { PLAY_TYPE_BY_FILTER, PLAY_TYPE_FILTER } from '../_consts/tournamentPlayType';
import {
  STATUS_BY_TAB,
  TOURNAMENT_STATUS_TABS,
  TOURNAMENT_TAB_ID_PREFIX,
  TOURNAMENT_TAB_PANEL_ID,
} from '../_consts/tournamentTab';
import type { TournamentPlayTypeFilterT } from '../_types/tournamentPlayType';
import type { TournamentStatusTabT } from '../_types/tournamentTab';
import { parsePlayParam, parseTabParam } from '../_utils/tournamentSearchParams';
import TournamentHistoryList from './TournamentHistoryList';
import TournamentHistorySkeleton from './TournamentHistorySkeleton';
import TournamentPlayTypeFilter from './TournamentPlayTypeFilter';

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

  const queryClient = useQueryClient();
  const pullToRefresh = usePullToRefresh(() =>
    queryClient.refetchQueries(
      {
        queryKey: QUERY_KEYS.TOURNAMENT.LIST.BY_PARAMS({
          status: STATUS_BY_TAB[activeTab],
          playType: PLAY_TYPE_BY_FILTER[activePlayTypeFilter],
        }),
        exact: true,
      },
      { throwOnError: true }
    )
  );

  return (
    <>
      <div
        className="sticky top-0 flex w-full flex-col gap-6 bg-bg-layer-default px-5 pt-padding-top pb-3"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        <CollapsibleTitle title="내 토너먼트" />
        <div className="flex flex-col gap-3">
          <UnderlineTab
            tabs={TOURNAMENT_STATUS_TABS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            idPrefix={TOURNAMENT_TAB_ID_PREFIX}
            panelId={TOURNAMENT_TAB_PANEL_ID}
          />
          <TournamentPlayTypeFilter
            activeFilter={activePlayTypeFilter}
            onFilterChange={handlePlayTypeFilterChange}
          />
        </div>
      </div>
      <PullToRefresh {...pullToRefresh} />
      <div
        id={TOURNAMENT_TAB_PANEL_ID}
        role="tabpanel"
        aria-labelledby={`${TOURNAMENT_TAB_ID_PREFIX}-${activeTab}`}
        className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-46"
      >
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
