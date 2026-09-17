'use client';

import Link from 'next/link';

import { EditIconFill, PersonIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';
import { getLoginPath } from '@/utils/loginRedirect';
import type { MemberUserT } from '@/types/user';

function ProfileSection() {
  const { userData } = useGetMe();

  return (
    <section className="flex w-full flex-col">
      {/** 게스트는 계정이 없어 프로필 대신 로그인을 유도한다 */}
      {userData.identityType === 'GUEST' ? (
        <Link
          href={getLoginPath(ROUTES.MYPAGE)}
          className="flex items-center gap-4 rounded-xl bg-bg-layer-default p-5"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-neutral-tertiary">
            <PersonIconFill aria-hidden className="size-5 text-icon-neutral-secondary" />
          </span>
          <p className="min-w-0 flex-1 truncate body-1-medium text-text-neutral-secondary">
            로그인해주세요.
          </p>
        </Link>
      ) : (
        <Link
          href={ROUTES.MYPAGE_EDIT}
          className="flex items-center gap-4 rounded-xl bg-bg-layer-default p-5"
        >
          <ProfileSummary userData={userData} />
          <EditIconFill className="size-6 text-icon-neutral-secondary" />
        </Link>
      )}
    </section>
  );
}

type ProfileSummaryProps = {
  userData: MemberUserT;
};

function ProfileSummary({ userData }: ProfileSummaryProps) {
  return (
    <>
      <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
        <BaseImage
          src={userData.profileImage}
          alt={`${userData.nickname} 프로필 이미지`}
          sizes="32px"
          className="object-cover"
          loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate body-1-bold text-text-neutral-primary">{userData.nickname}</p>
        <p className="truncate body-2-medium text-text-neutral-tertiary" data-sentry-mask>
          {userData.email}
        </p>
      </div>
    </>
  );
}

export default ProfileSection;
