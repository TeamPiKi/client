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
      className={cn('flex w-full items-start gap-2.5 rounded-xl bg-base-50 px-5 py-3', className)}
    >
      <div className="h-[72px] w-[85px] bg-gray-50"></div> {/** TODO: 이미지 넣기 */}
      <div className="flex flex-1 flex-col items-start gap-2 self-center">
        <div className="flex items-center gap-2">
          <StatusChip status={status} />
          <Link
            href={HREF[status]}
            className="line-clamp-1 body-1-semibold text-text-neutral-primary hover:underline"
          >
            {name}
          </Link>
        </div>
        <UserProfileGroup profileImageUrls={profileImageUrls} max={maxProfiles} />
      </div>
      <MorePopover
        status={status}
        tournamentId={tournamentId}
        participantCount={participantCount}
      />
    </article>
  );
}

export default TournamentCard;
