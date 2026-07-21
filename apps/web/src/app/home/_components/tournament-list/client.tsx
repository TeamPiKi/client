'use client';

import Link from 'next/link';

import { ChevronForwardIconFill } from '@/assets/icons';
import TournamentCard from '@/components/tournament-card';
import { ROUTES } from '@/consts/route';
import { useGetTournamentList } from '@/hooks/useGetTournamentList';
import type { TournamentStatusT } from '@/types/tournament';

type Props = {
  statuses: TournamentStatusT[];
};

function TournamentListClient({ statuses }: Props) {
  const { tournamentListData } = useGetTournamentList(statuses, 3);

  if (tournamentListData.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="heading-2-semibold text-black">최근 생성한 토너먼트</h2>
        <Link href={ROUTES.TOURNAMENT_HISTORY}>
          <ChevronForwardIconFill className="size-6 text-icon-neutral-secondary" />
        </Link>
      </div>

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
    </section>
  );
}

export default TournamentListClient;
