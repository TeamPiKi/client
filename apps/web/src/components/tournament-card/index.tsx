import Link from 'next/link';

import StatusChip from '@/components/status-chip';
import UserProfileGroup from '@/components/user-profile-group';
import { ROUTES } from '@/consts/route';
import type { TournamentStatusT } from '@/types/tournament';
import { cn } from '@/utils/cn';

import MorePopover from './MorePopover';

type TournamentCardProps = {
  tournamentId: number;
  status: TournamentStatusT;
  name: string;
  date: string;
  profileImageUrls: string[];
  maxProfiles?: number;
  /** 본인 포함 참여자 수. 2명 이상이면 더보기에 '친구 목록 보기' 메뉴 노출. */
  participantCount?: number;
  className?: string;
};

function TournamentCard({
  tournamentId,
  status,
  name,
  date,
  profileImageUrls,
  maxProfiles = 3,
  participantCount,
  className,
}: TournamentCardProps) {
  const HREF = {
    PENDING: ROUTES.TOURNAMENT_CREATE(tournamentId),
    IN_PROGRESS: ROUTES.TOURNAMENT_MATCH(tournamentId),
    COMPLETED: ROUTES.TOURNAMENT_RESULT(tournamentId),
  } as const;

  return (
    <article
      className={cn(
        'flex w-full flex-col gap-2 rounded-xl bg-bg-layer-default px-6 py-5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <StatusChip status={status} />
          <Link
            href={HREF[status]}
            className="line-clamp-1 heading-1 text-text-neutral-primary hover:underline"
          >
            {name}
          </Link>
        </div>
        <MorePopover
          status={status}
          tournamentId={tournamentId}
          participantCount={participantCount}
        />
      </div>
      <div className="flex items-end justify-between">
        <span className="body-2-medium text-text-neutral-tertiary">{date}</span>
        <UserProfileGroup profileImageUrls={profileImageUrls} max={maxProfiles} />
      </div>
    </article>
  );
}

export default TournamentCard;
