'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';
import { replaceUrlKeepingState } from '@/utils/replaceUrlKeepingState';
import { getScrollContainer } from '@/utils/scrollRestoration';

import { PLAY_TYPE_BY_FILTER, PLAY_TYPE_FILTER } from '../_consts/tournamentPlayType';
import { STATUS_BY_TAB } from '../_consts/tournamentTab';
import type { TournamentPlayTypeFilterT } from '../_types/tournamentPlayType';
import type { TournamentStatusTabT } from '../_types/tournamentTab';
import { parsePlayParam, parseTabParam } from '../_utils/tournamentSearchParams';
import TournamentHistoryList from './TournamentHistoryList';
import TournamentHistorySkeleton from './TournamentHistorySkeleton';
import TournamentPlayTypeFilter from './TournamentPlayTypeFilter';
import TournamentStatusTab from './TournamentStatusTab';

const TITLE_HEIGHT_WITH_GAP = 52;

function TournamentHistorySection() {
  const searchParams = useSearchParams();
  const activeTab = parseTabParam(searchParams.get('tab'));
  const activePlayTypeFilter = parsePlayParam(searchParams.get('play'));
  
  const [isTitleHidden, setIsTitleHidden] = useState(false);

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

  /** 스크롤 시 제목 부분을 숨김/노출 처리 함 */
  useEffect(() => {
    const scroller = getScrollContainer();
    if (!scroller) return;

    const handleScroll = () => {
      if (scroller.scrollTop > TITLE_HEIGHT_WITH_GAP) setIsTitleHidden(true);
      else if (scroller.scrollTop <= 0) setIsTitleHidden(false);
    };
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div
        className="sticky top-0 flex w-full flex-col gap-6 bg-bg-layer-default px-5 pt-padding-top pb-3"
        style={{ zIndex: Z_INDEX.STICKY_HEADER }}
      >
        <div
          className={cn(
            'grid transition-all duration-100',
            isTitleHidden ? '-mb-6 grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr]'
          )}
        >
          <h1 className="min-h-0 overflow-hidden heading-1-bold text-text-neutral-primary">
            내 토너먼트
          </h1>
        </div>
        <div className="flex flex-col gap-3">
          <TournamentStatusTab activeTab={activeTab} onTabChange={handleTabChange} />
          <TournamentPlayTypeFilter
            activeFilter={activePlayTypeFilter}
            onFilterChange={handlePlayTypeFilterChange}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-46">
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
