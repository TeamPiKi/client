import Image from 'next/image';

import { cn } from '@/utils/cn';

import { PROFILE_SVG, type UserT } from './userProfile.const';

type UserProfileProps = {
  user: UserT;
  className?: string;
};

function UserProfile({ user, className }: UserProfileProps) {
  const SvgComponent = PROFILE_SVG[user.profileType ?? 'blue'];

  if (user.imageUrl) {
    return (
      <span
        className={cn(
          'relative block size-6.75 shrink-0 overflow-hidden rounded-full border-[1.6px] border-white',
          className
        )}
      >
        <Image
          src={user.imageUrl}
          alt={`${user.name} 프로필 이미지`}
          fill
          sizes="27px"
          className="object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'flex size-[27px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.6px] border-white bg-bg-layer-default',
        className
      )}
      aria-label={user.name}
    >
      <SvgComponent className="size-full" />
    </span>
  );
}

export default UserProfile;
