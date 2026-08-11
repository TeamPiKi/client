'use client';

import Link from 'next/link';

import { ChevronForwardIconFill, TrophyIconFill } from '@/assets/icons/fill';
import { ROUTES } from '@/consts/route';

type GroupResultEntryCardProps = {
  tournamentId: number;
};

function GroupResultEntryCard({ tournamentId }: GroupResultEntryCardProps) {
  return (
    <Link
      href={ROUTES.TOURNAMENT_GROUP_RESULT(tournamentId)}
      className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl bg-bg-layer-default px-4 py-[14px]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <TrophyIconFill className="size-6 shrink-0 text-sky-blue-400" aria-hidden />
        <p className="truncate body-1-semibold text-sky-blue-400">전체 결과 보기</p>
      </div>
      <ChevronForwardIconFill className="size-6 shrink-0 text-icon-neutral-secondary" />
    </Link>
  );
}

export default GroupResultEntryCard;
