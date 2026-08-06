import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getTournamentList } from '@/apis/getTournamentList';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { getQueryClient } from '@/utils/queryClient';

import TournamentFab from './_components/TournamentFab';
import TournamentHistorySection from './_components/TournamentHistorySection';
import { PLAY_TYPE_BY_FILTER } from './_consts/tournamentPlayType';
import { STATUS_BY_TAB } from './_consts/tournamentTab';
import { parsePlayParam, parseTabParam } from './_utils/tournamentSearchParams';

type Props = {
  searchParams: Promise<{ tab?: string; play?: string }>;
};

async function ArchiveTournamentPage({ searchParams }: Props) {
  const { tab, play } = await searchParams;

  const queryClient = getQueryClient();

  const params = {
    status: STATUS_BY_TAB[parseTabParam(tab)],
    playType: PLAY_TYPE_BY_FILTER[parsePlayParam(play)],
  };
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TOURNAMENT.LIST.BY_PARAMS(params),
    queryFn: () => getTournamentList(params),
  });

  return (
    <main className="flex min-h-dvh flex-col bg-bg-layer-basement px-5">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TournamentHistorySection />
      </HydrationBoundary>
      <TournamentFab />
    </main>
  );
}

export default ArchiveTournamentPage;
