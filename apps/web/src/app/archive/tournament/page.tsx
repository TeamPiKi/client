import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getTournamentList } from '@/apis/getTournamentList';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { getQueryClient } from '@/utils/queryClient';

import TournamentFab from './_components/TournamentFab';
import TournamentHistorySection from './_components/TournamentHistorySection';
import {
  PLAY_TYPE_BY_FILTER,
  PLAY_TYPE_FILTER,
  type TournamentPlayTypeFilterT,
} from './_consts/tournamentPlayType';
import { STATUS_BY_TAB, type TournamentStatusTabT } from './_consts/tournamentTab';

type Props = {
  searchParams: Promise<{ tab?: string; play?: string }>;
};

async function ArchiveTournamentPage({ searchParams }: Props) {
  const { tab, play } = await searchParams;
  const initialTab: TournamentStatusTabT = tab === 'completed' ? 'completed' : 'ongoing';
  const initialPlayTypeFilter: TournamentPlayTypeFilterT =
    play === PLAY_TYPE_FILTER.SOLO || play === PLAY_TYPE_FILTER.SOCIAL
      ? play
      : PLAY_TYPE_FILTER.ALL;

  const queryClient = getQueryClient();

  const params = {
    status: STATUS_BY_TAB[initialTab],
    playType: PLAY_TYPE_BY_FILTER[initialPlayTypeFilter],
  };
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TOURNAMENT.LIST.BY_PARAMS(params),
    queryFn: () => getTournamentList(params),
  });

  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-basement px-5">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TournamentHistorySection
          initialTab={initialTab}
          initialPlayTypeFilter={initialPlayTypeFilter}
        />
      </HydrationBoundary>
      <TournamentFab />
    </main>
  );
}

export default ArchiveTournamentPage;
