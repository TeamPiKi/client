import WishlistLayout from './_components/WishlistLayout';
import TournamentHistoryContent from './_components/tournament-history-content';
import WishContent from './_components/wish-content';
import type { WishTabT } from './_types/wish';

type ArchivePageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const getActiveWishTab = (tab?: string): WishTabT => {
  if (tab === 'tournament') return '토너먼트 기록';
  return '저장한 위시템';
};

async function ArchivePage({ searchParams }: ArchivePageProps) {
  const { tab } = await searchParams;
  const activeTab = getActiveWishTab(tab);

  return (
    <WishlistLayout>
      {activeTab === '저장한 위시템' && <WishContent />}
      {activeTab === '토너먼트 기록' && <TournamentHistoryContent />}
    </WishlistLayout>
  );
}

export default ArchivePage;
