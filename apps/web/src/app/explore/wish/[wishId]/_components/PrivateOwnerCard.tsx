import { LockIconFill } from '@/assets/icons';

function PrivateOwnerCard() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-bg-layer-default p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <LockIconFill className="size-[22px] text-white" aria-hidden />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="body-1-semibold text-text-neutral-primary">비공개된 유저</p>
        <p className="caption-1-regular text-text-neutral-secondary">비공개된 폴더</p>
      </div>
    </div>
  );
}

export default PrivateOwnerCard;
