'use client';

import TournamentCard from '@/components/tournament-card';
import { useGetTournamentList } from '@/hooks/useGetTournamentList';
import type { TournamentStatusT } from '@/types/tournament';

type Props = {
  statuses: TournamentStatusT[];
};

function TournamentListClient({ statuses }: Props) {
  const { tournamentListData } = useGetTournamentList(statuses);

  if (tournamentListData.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="heading-2 text-black">진행 중인 토너먼트</h2>

      {tournamentListData.map(tournament => (
        <TournamentCard
          key={tournament.tournamentId}
          tournamentId={tournament.tournamentId}
          status={tournament.status}
          name={tournament.name}
          date={tournament.createdAt.slice(0, 10).replaceAll('-', '/')}
          profileImageUrls={tournament.participantProfileImages}
          participantCount={tournament.participantProfileImages.length}
        />
      ))}
    </section>
  );
}

export default TournamentListClient;
