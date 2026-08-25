import { TrophyIconFill } from '@/assets/icons';

type RoundBadgeProps = {
  label: string;
  isFinal?: boolean;
};

function RoundBadge({ label, isFinal = false }: RoundBadgeProps) {
  if (isFinal) {
    return (
      <div className="inline-flex items-center justify-center gap-1.5 rounded-[28px] bg-white px-5 py-3">
        <TrophyIconFill className="size-4.5 text-yellow-400" aria-hidden />
        <span className="heading-2-semibold text-text-neutral-secondary">결승전</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center justify-center gap-2.5 rounded-[30px] bg-gray-100 px-5 py-3 heading-2-semibold text-text-neutral-primary">
      {label}
    </div>
  );
}

export default RoundBadge;
