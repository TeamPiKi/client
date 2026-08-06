'use client';

import TournamentEmptyState from '@/components/common/tournament-empty-state';
import TournamentCard from '@/components/tournament-card';
import { useGetTournamentList } from '@/hooks/useGetTournamentList';
import type { TournamentStatusT } from '@/types/tournament';

type Props = {
  statuses: TournamentStatusT[];
};

function TournamentHistoryList({ statuses }: Props) {
  const { tournamentListData } = useGetTournamentList({ status: statuses });

  if (tournamentListData.length === 0)
    return (
      <div className="flex flex-1 flex-col items-center justify-center pb-24">
        <TournamentEmptyState />
      </div>
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
