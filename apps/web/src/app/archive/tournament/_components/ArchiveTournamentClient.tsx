'use client';

import { Suspense, useState } from 'react';

import BottomTabBar from '@/components/bottom-tab-bar';
import type { TournamentStatusT } from '@/types/tournament';

import WishlistLayout from '../../_components/WishlistLayout';
import TournamentHistoryList from './TournamentHistoryList';
import TournamentStatusTab, { type TournamentStatusTabT } from './TournamentStatusTab';

const STATUS_BY_TAB: Record<TournamentStatusTabT, TournamentStatusT[]> = {
  'in-progress': ['PENDING', 'IN_PROGRESS'],
  completed: ['COMPLETED'],
};

function ArchiveTournamentClient() {
  const [activeTab, setActiveTab] = useState<TournamentStatusTabT>('in-progress');

  return (
    <WishlistLayout title="내 토너먼트">
      <TournamentStatusTab activeTab={activeTab} onTabChange={setActiveTab} />
      <Suspense
        fallback={
          <main className="flex flex-1 flex-col items-center justify-center pb-24">
            <p className="body-1-semibold text-text-neutral-tertiary">토너먼트를 불러오는 중이에요</p>
          </main>
        }
      >
        <TournamentHistoryList key={activeTab} statuses={STATUS_BY_TAB[activeTab]} />
      </Suspense>
      <div className="fixed bottom-10 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        <BottomTabBar />
      </div>
    </WishlistLayout>
  );
}

export default ArchiveTournamentClient;
