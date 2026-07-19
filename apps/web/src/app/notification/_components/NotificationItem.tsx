import { cn } from '@/utils/cn';

type NotificationItemProps = {
  profileImage?: string;
  message: string;
  time: string;
  isRead?: boolean;
  onClick?: () => void;
};

function NotificationItem({ profileImage, message, time, isRead, onClick }: NotificationItemProps) {
  const innerContent = (
    <>
      <div className="size-8 shrink-0 overflow-hidden rounded-full bg-sky-blue-200">
        {profileImage && <img src={profileImage} alt="" className="size-full object-cover" />}
      </div>
      <div className="flex flex-col gap-1">
        <p className="body-1-semibold text-text-neutral-secondary">{message}</p>
        <span className="caption-1-regular text-text-neutral-tertiary">{time}</span>
      </div>
    </>
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
