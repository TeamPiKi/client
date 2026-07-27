import { NotificationIconFill } from '@/assets/icons';
import Button from '@/components/button';

const VARIANTS = {
  empty: {
    heading: '새로운 알림이 없어요',
    body: (
      <>
        토너먼트에 참여하고,
        <br />
        친구를 초대해서 소식을 받아보세요
      </>
    ),
    buttonLabel: '기기 알림 설정',
  },
  error: {
    heading: '알림을 불러오지 못했어요',
    body: (
      <>
        일시적인 오류예요.
        <br />
        잠시 후 다시 시도해 주세요
      </>
    ),
    buttonLabel: '다시 시도',
  },
} as const;

type NotificationStateCardProps = {
  variant: keyof typeof VARIANTS;
  onAction: () => void;
};

function NotificationStateCard({ variant, onAction }: NotificationStateCardProps) {
  const { heading, body, buttonLabel } = VARIANTS[variant];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[15px] px-6">
      <NotificationIconFill width={90} height={90} className="text-gray-100" aria-hidden />
      <div className="flex flex-col items-center gap-[15px]">
        <h1 className="heading-2-semibold text-text-neutral-secondary">{heading}</h1>
        <p className="text-center body-2-medium text-text-neutral-tertiary">{body}</p>
      </div>
      <Button variant="secondary" size="md" onClick={onAction}>
        {buttonLabel}
      </Button>
    </div>
  );
}

export default NotificationStateCard;
