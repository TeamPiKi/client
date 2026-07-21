import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getTournamentList } from '@/apis/getTournamentList';
import BottomTabBar from '@/components/bottom-tab-bar';
import { getQueryClient } from '@/utils/queryClient';

import TournamentFab from './_components/TournamentFab';
import TournamentHistorySection from './_components/TournamentHistorySection';
import { STATUS_BY_TAB, type TournamentStatusTabT } from './_consts/tournamentTab';

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

async function ArchiveTournamentPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const initialTab: TournamentStatusTabT = tab === 'completed' ? 'completed' : 'ongoing';

  const queryClient = getQueryClient();
  const statuses = STATUS_BY_TAB[initialTab];
  await queryClient.prefetchQuery({
    queryKey: ['tournamentList', statuses],
    queryFn: () => getTournamentList(statuses),
  });

  return (
    <div className="flex min-h-dvh flex-col bg-bg-layer-basement px-5">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TournamentHistorySection initialTab={initialTab} />
      </HydrationBoundary>
      <TournamentFab />
      <BottomTabBar />
    </div>
  );
}

export default ArchiveTournamentPage;
