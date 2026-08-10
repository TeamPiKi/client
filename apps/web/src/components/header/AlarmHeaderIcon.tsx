'use client';

import Link from 'next/link';

import { useGetNotifications } from '@/app/notification/_hooks/useGetNotifications';
import { NotificationIconFill } from '@/assets/icons/fill';
import { ROUTES } from '@/consts/route';
import { cn } from '@/utils/cn';

type AlarmHeaderIconProps = {
  className?: string;
  onClick?: () => void;
};

const MAX_DISPLAY_COUNT = 99;

function AlarmHeaderIcon({ className, onClick }: AlarmHeaderIconProps) {
  const { unreadCount } = useGetNotifications();

  const hasUnread = unreadCount > 0;
  const isOverflow = unreadCount > MAX_DISPLAY_COUNT;
  const displayCount = isOverflow ? `${MAX_DISPLAY_COUNT}+` : unreadCount;

  return (
    <Link
      href={ROUTES.NOTIFICATION}
      aria-label={hasUnread ? `알림 ${unreadCount}개 안 읽음` : '알림'}
      className={cn('relative cursor-pointer p-[3px]', className)}
      onClick={onClick}
    >
      <NotificationIconFill className="size-6 text-icon-neutral-secondary" />

      {hasUnread && (
        <span
          aria-hidden
          className={cn(
            'absolute bottom-4 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1.25 text-[12px] leading-none text-white',
            isOverflow ? 'left-[calc(50%+5px)] -translate-x-1/2' : 'left-3'
          )}
        >
          {displayCount}
        </span>
      )}
    </Link>
  );
}

export default AlarmHeaderIcon;
