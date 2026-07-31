'use client';

import TournamentEmptyState from '@/components/common/tournament-empty-state';
import TournamentCard from '@/components/tournament-card';
import { useGetTournamentList } from '@/hooks/useGetTournamentList';
import type { TournamentPlayTypeT, TournamentStatusT } from '@/types/tournament';

type Props = {
  statuses: TournamentStatusT[];
  playType?: TournamentPlayTypeT;
};

function TournamentHistoryList({ statuses, playType }: Props) {
  const { tournamentListData } = useGetTournamentList({ status: statuses, playType });

  if (tournamentListData.length === 0)
    return (
      <main className="flex flex-1 flex-col items-center justify-center pb-24">
        <TournamentEmptyState />
      </main>
    );

  return (
    <>
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
    </>
  );
}

export default TournamentHistoryList;
