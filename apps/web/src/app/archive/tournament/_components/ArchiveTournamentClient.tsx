'use client';

import { Suspense, useState } from 'react';

import type { TournamentStatusT } from '@/types/tournament';

import ArchivePageLayout from '../../_common/_components/ArchivePageLayout';
import TournamentHistoryList from './TournamentHistoryList';
import TournamentStatusTab, { type TournamentStatusTabT } from './TournamentStatusTab';

const STATUS_BY_TAB: Record<TournamentStatusTabT, TournamentStatusT[]> = {
  'in-progress': ['PENDING', 'IN_PROGRESS'],
  completed: ['COMPLETED'],
};

function ArchiveTournamentClient() {
  const [activeTab, setActiveTab] = useState<TournamentStatusTabT>('in-progress');

  return (
    <ArchivePageLayout title="내 토너먼트">
      <TournamentStatusTab activeTab={activeTab} onTabChange={setActiveTab} />
      <Suspense
        fallback={
          <main className="flex flex-1 flex-col items-center justify-center pb-24">
            <p className="body-1-semibold text-text-neutral-tertiary">
              토너먼트를 불러오는 중이에요
            </p>
          </main>
        }
      >
        <TournamentHistoryList key={activeTab} statuses={STATUS_BY_TAB[activeTab]} />
      </Suspense>
    </ArchivePageLayout>
  );
}

export default ArchiveTournamentClient;
