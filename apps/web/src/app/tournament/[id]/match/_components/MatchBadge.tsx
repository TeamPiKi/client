import { cn } from '@/utils/cn';

import { carmenSans } from '../../_common/_consts/font';

type MatchBadgeProps = {
  /** 라운드 안에서 몇 번째 매치인지 (0부터) */
  matchIndex: number;
  isFinal?: boolean;
};

function MatchBadge({ matchIndex, isFinal = false }: MatchBadgeProps) {
  const label = isFinal ? 'Final' : `Match ${matchIndex + 1}`;

  return (
    <span
      className={cn(
        carmenSans.className,
        'rounded-full bg-sky-blue-300 px-2.5 py-2.5 text-[12px] leading-[9px] font-bold tracking-[-0.3px] text-white'
      )}
    >
      {label}
    </span>
  );
}

export default MatchBadge;
