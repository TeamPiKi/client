import { NotificationIconFill } from '@/assets/icons';
import Button from '@/components/button';

type NotificationEmptyStateProps = {
  onOpenNotificationSettings: () => void;
};

function NotificationEmptyState({ onOpenNotificationSettings }: NotificationEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[15px] px-6">
      <NotificationIconFill width={90} height={90} className="text-gray-100" aria-hidden />
      <div className="flex flex-col items-center gap-[15px]">
        <h1 className="heading-2-semibold text-text-neutral-secondary">새로운 알림이 없어요</h1>
        <p className="text-center body-2-medium text-text-neutral-tertiary">
          토너먼트에 참여하고,
          <br />
          친구를 초대해서 소식을 받아보세요
        </p>
      </div>
      <Button variant="secondary" size="md" onClick={onOpenNotificationSettings}>
        기기 알림 설정
      </Button>
    </div>
  );
}

export default NotificationEmptyState;
