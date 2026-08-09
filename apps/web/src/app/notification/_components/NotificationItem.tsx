import type { ComponentType, SVGProps } from 'react';

import { BasketIconFill, HeartIconFill, LiveIconOutline } from '@/assets/icons';
import type { NotificationKindT } from '@/types/notification';
import { cn } from '@/utils/cn';

type NotificationKindDisplayT = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const KIND_DISPLAY: Record<NotificationKindT, NotificationKindDisplayT> = {
  WISH: { label: '위시', Icon: HeartIconFill },
  TOURNAMENT: { label: '토너먼트', Icon: BasketIconFill },
  SYSTEM: { label: '공지', Icon: LiveIconOutline },
};

type NotificationItemProps = {
  kind: NotificationKindT;
  message: string;
  time: string;
  isRead?: boolean;
  onClick?: () => void;
};

function NotificationItem({ kind, message, time, isRead, onClick }: NotificationItemProps) {
  const { label, Icon } = KIND_DISPLAY[kind];

  const innerContent = (
    <div className="flex w-full flex-col gap-1">
      <span className="flex items-center gap-1.5 caption-1-semibold text-text-neutral-secondary">
        <Icon aria-hidden className="size-4 text-icon-accent" />
        {label}
      </span>
      <p className="mt-1 body-1-semibold text-text-neutral-primary">{message}</p>
      <span className="caption-1-regular text-text-neutral-tertiary">{time}</span>
    </div>
  );

  if (onClick) {
    return (
      <li className={cn(isRead && 'opacity-50')}>
        <button
          type="button"
          onClick={onClick}
          className="flex w-full cursor-pointer items-center gap-3 py-5 text-left"
        >
          {innerContent}
        </button>
      </li>
    );
  }

  return (
    <li className={cn('flex items-center gap-3 py-5', isRead && 'opacity-50')}>{innerContent}</li>
  );
}

export default NotificationItem;
