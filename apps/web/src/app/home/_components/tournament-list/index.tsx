import { Suspense } from 'react';

import type { TournamentStatusT } from '@/types/tournament';

import TournamentListClient from './client';
import TournamentListSkeleton from './TournamentListSkeleton';

const TOURNAMENT_LIST_STATUS: TournamentStatusT[] = ['PENDING', 'IN_PROGRESS'];

function TournamentList() {
  return (
    <Suspense fallback={<TournamentListSkeleton />}>
      <TournamentListClient statuses={TOURNAMENT_LIST_STATUS} />
    </Suspense>
  );
}

export default TournamentList;
