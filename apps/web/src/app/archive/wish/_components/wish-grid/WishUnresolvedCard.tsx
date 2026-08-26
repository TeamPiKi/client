import { WarningIconFill } from '@/assets/icons';

/** 정보를 못 가져왔거나(FAILED) 일부만 가져온(INCOMPLETE) 위시 카드 — 문구만 다르다 */

function WishUnresolvedCard({ message }: { message: string }) {
  return (
    <div className="relative flex flex-col bg-black/5">
      <div className="aspect-[201/166] w-full" />
      <div className="h-[124px]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
        <WarningIconFill className="size-6 text-icon-neutral-secondary" />
        <p className="body-2-semibold text-text-neutral-secondary">{message}</p>
        <p className="body-2-medium text-text-neutral-secondary underline underline-offset-[3px]">
          직접 입력하기
        </p>
      </div>
    </div>
  );
}

export default WishUnresolvedCard;
