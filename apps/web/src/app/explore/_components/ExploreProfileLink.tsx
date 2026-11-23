'use client';

import Link from 'next/link';
import { Suspense } from 'react';

import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';
import { ROUTES } from '@/consts/route';
import { useGetMe } from '@/hooks/useGetMe';

function ExploreProfileLink() {
  return (
    <Suspense fallback={<Skeleton shape="circle" className="size-6" />}>
      <ProfileLink />
    </Suspense>
  );
}

function ProfileLink() {
  const { userData } = useGetMe();

  return (
    <Link
      href={ROUTES.PROFILE(userData.id)}
      aria-label="내 프로필"
      className="flex size-7.5 cursor-pointer items-center justify-center"
    >
      <span className="relative size-6 overflow-hidden rounded-full">
        <BaseImage
          src={userData.profileImage}
          alt=""
          sizes="24px"
          className="object-cover"
          loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
        />
      </span>
    </Link>
  );
}

export default ExploreProfileLink;
