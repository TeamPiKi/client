import { WarningIconFill } from '@/assets/icons';

function WishFailedCard() {
  return (
    <div className="flex aspect-[0.765] flex-col items-center justify-center gap-3 rounded-xl bg-black/5 p-4">
      <WarningIconFill className="size-6 text-icon-neutral-secondary" />
      <p className="body-2-semibold text-text-neutral-secondary">가져오는데 실패했어요</p>
      <p className="body-2-medium text-text-neutral-secondary underline underline-offset-[3px]">
        직접 입력하기
      </p>
    </div>
  );
}

export default WishFailedCard;
