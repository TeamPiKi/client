'use client';

import TournamentEmptyState from '@/components/common/tournament-empty-state';
import TournamentCard from '@/components/tournament-card';
import { useGetTournamentList } from '@/hooks/useGetTournamentList';
import type { TournamentStatusT } from '@/types/tournament';

type Props = {
  statuses: TournamentStatusT[];
  limit: number;
};

function TournamentListClient({ statuses, limit }: Props) {
  const { tournamentListData } = useGetTournamentList(statuses, limit);

  if (tournamentListData.length === 0)
    return (
      <div className="flex flex-1 items-center justify-center">
        <TournamentEmptyState variant="muted" />
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
          showMorePopover={false}
        />
      ))}
    </>
  );
}

export default TournamentListClient;
