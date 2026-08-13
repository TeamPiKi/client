import { ChevronForwardIconFill, NotificationIconFill } from '@/assets/icons';

type Props = {
  onOpenNotificationSettings: () => void;
};

function PushDisabledBanner({ onOpenNotificationSettings }: Props) {
  return (
    <button
      type="button"
      onClick={onOpenNotificationSettings}
      className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-gray-75 px-4 py-4 text-left"
    >
      <div className="flex h-6 items-center gap-3">
        <NotificationIconFill className="size-6 text-icon-neutral-primary" aria-hidden />
        <span className="body-1-medium text-text-neutral-secondary">기기 알림을 켜주세요</span>
      </div>
      <ChevronForwardIconFill className="size-6 text-icon-neutral-secondary" aria-hidden />
    </button>
  );
}

export default PushDisabledBanner;
