import type { ReactNode } from 'react';

import BaseImage from '@/components/base-image';
import Skeleton from '@/components/skeleton';

type FriendListItemProps = {
  nickname: string;
  profileImage: string;
  description?: string;
  action?: ReactNode;
};

function FriendListItem({ nickname, profileImage, description, action }: FriendListItemProps) {
  return (
    <li className="flex h-17 items-center gap-3.5 p-5">
      <span className="relative size-7.5 shrink-0 overflow-hidden rounded-full outline-[2.6px] outline-white">
        <BaseImage
          src={profileImage}
          alt={`${nickname} 프로필 이미지`}
          sizes="30px"
          className="object-cover"
          loadingFallback={<Skeleton shape="circle" className="absolute inset-0" />}
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate body-1-semibold text-text-neutral-primary">{nickname}</p>
        {description && (
          <p className="truncate caption-1-regular text-text-neutral-secondary">{description}</p>
        )}
      </div>
      {action}
    </li>
  );
}

export default FriendListItem;
