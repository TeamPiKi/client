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
      className={cn(
        'flex w-full items-center gap-2.5 rounded-2xl bg-bg-layer-default px-5 py-3',
        className
      )}
    >
      {/* 아이템 이미지 스택 — 목록 API 에 아이템 이미지가 없어 시안과 동일한 placeholder 로 표시 */}
      <div aria-hidden className="relative h-16.5 w-18.5 shrink-0">
        <div className="absolute top-0 left-3 size-15.5 rotate-10 rounded-[15px] border-[1.85px] border-white bg-bg-layer-basement opacity-60 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]" />
        <div className="absolute top-1 left-0 size-15.5 rounded-[15px] border-[1.85px] border-white bg-bg-layer-basement shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
        <div className="flex items-center justify-between gap-1">
          <div className="flex min-w-0 items-center gap-2">
            <StatusChip status={status} />
            <Link
              href={HREF[status]}
              className="line-clamp-1 body-1-semibold text-text-neutral-primary hover:underline"
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
        <UserProfileGroup profileImageUrls={profileImageUrls} max={maxProfiles} size="sm" />
      </div>
    </article>
  );
}

export default TournamentCard;
