import { NotificationIconFill } from '@/assets/icons';
import Button from '@/components/button';

type NotificationErrorStateProps = {
  onRetry: () => void;
};

function NotificationErrorState({ onRetry }: NotificationErrorStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[15px] px-6">
      <NotificationIconFill width={90} height={90} className="text-gray-100" aria-hidden />
      <div className="flex flex-col items-center gap-[15px]">
        <h1 className="heading-2 text-text-neutral-secondary">알림을 불러오지 못했어요</h1>
        <p className="text-center body-2-medium text-text-neutral-tertiary">
          일시적인 오류예요.
          <br />
          잠시 후 다시 시도해 주세요
        </p>
      </div>
      <Button variant="secondary" size="md" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

export default NotificationErrorState;
