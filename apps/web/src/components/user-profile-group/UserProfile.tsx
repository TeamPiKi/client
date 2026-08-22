import Image from 'next/image';

import { cn } from '@/utils/cn';

import type { UserT } from './userProfile.types';

type UserProfileProps = {
  user: UserT;
  className?: string;
};

function UserProfile({ user, className }: UserProfileProps) {
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

export default UserProfile;
