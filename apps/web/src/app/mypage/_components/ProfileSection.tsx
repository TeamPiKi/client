'use client';

import Link from 'next/link';

import { EditIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';

function ProfileSection() {
  const { userData } = useGetMe();

  return (
    <section className="flex w-full flex-col gap-3">
      <h2 className="body-1-bold text-text-neutral-primary">프로필</h2>

      <Link
        href={ROUTES.MYPAGE_EDIT}
        className="flex items-center gap-4 rounded-xl bg-bg-layer-default p-5"
      >
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
          {userData.identityType === 'MEMBER' && (
            <p className="truncate body-2-medium text-text-neutral-tertiary" data-sentry-mask>
              {userData.email}
            </p>
          )}
        </div>

        <EditIconFill className="size-6 text-icon-neutral-secondary" />
      </Link>
    </section>
  );
}

export default ProfileSection;
