import BottomTabBar from '@/components/bottom-tab-bar';

import TournamentFab from './_components/TournamentFab';
import TournamentHistoryContent from './_components/TournamentHistoryContent';
import type { TournamentStatusTabT } from './_consts/tournamentTab';

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

async function ArchiveTournamentPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const activeTab: TournamentStatusTabT = tab === 'completed' ? 'completed' : 'ongoing';

  return (
    <div className="flex min-h-dvh flex-col bg-bg-layer-basement px-5">
      <TournamentHistoryContent activeTab={activeTab} />
      <TournamentFab />
      <BottomTabBar />
    </div>
  );
}

export default ArchiveTournamentPage;
