'use client';

import TournamentEmptyState from '@/components/common/tournament-empty-state';
import TournamentCard from '@/components/tournament-card';
import { useGetTournamentList } from '@/hooks/useGetTournamentList';
import type { TournamentStatusT } from '@/types/tournament';

type Props = {
  statuses: TournamentStatusT[];
};

function TournamentHistoryList({ statuses }: Props) {
  const { tournamentListData } = useGetTournamentList(statuses);

  if (tournamentListData.length === 0)
    return (
      <main className="flex flex-1 flex-col items-center justify-center pb-24">
        <TournamentEmptyState />
      </main>
    );

  return (
    <main className="hide-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pt-6 pb-24">
      {tournamentListData.map(tournament => (
        <TournamentCard
          key={tournament.tournamentId}
          imageUrls={tournament.thumbnailUrls}
          tournamentId={tournament.tournamentId}
          status={tournament.status}
          name={tournament.name}
          profileImageUrls={tournament.participantProfileImages}
          participantCount={tournament.participantProfileImages.length}
        />
      ))}
    </main>
  );
}

export default TournamentHistoryList;
