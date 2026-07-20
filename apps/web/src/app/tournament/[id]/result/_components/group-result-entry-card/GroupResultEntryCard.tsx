'use client';

import Link from 'next/link';

import { ChevronForwardIconFill } from '@/assets/icons/fill';
import UserProfileGroup from '@/components/user-profile-group';
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
        {/* 시안 기준 흰 테두리 더 얇게 — 공통 UserProfileGroup 의 1.6px 두께를 카드 안에서만 1px 로 override */}
        <div className="[&_.rounded-full]:border! [&_.rounded-full]:border-white!">
          <UserProfileGroup
            profileImageUrls={[
              'https://dev-piki-images-250758375457.s3.ap-northeast-2.amazonaws.com/defaults/user-profile-1.png',
              'https://dev-piki-images-250758375457.s3.ap-northeast-2.amazonaws.com/defaults/user-profile-2.png',
              'https://dev-piki-images-250758375457.s3.ap-northeast-2.amazonaws.com/defaults/user-profile-3.png',
            ]}
            max={3}
          />
        </div>
        <p className="truncate body-1-semibold text-sky-400">전체 결과 보기</p>
      </div>
      <ChevronForwardIconFill className="text-icon-neutral-secondary size-6 shrink-0" />
    </Link>
  );
}

export default GroupResultEntryCard;
