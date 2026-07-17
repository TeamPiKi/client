'use client';

import { TrophyIconFill } from '@/assets/icons';
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
      <main className="flex flex-1 flex-col items-center justify-center gap-3 pb-24">
        <TrophyIconFill width={32} height={32} className="text-gray-200" />
        <p className="body-1-semibold text-text-neutral-tertiary">아직 진행한 토너먼트가 없어요</p>
      </main>
    );

  return (
    <main className="hide-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto pb-24">
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
