'use client';

import { TimerIconFill } from '@/assets/icons/fill';

import { useCountdown } from '../../_hooks/useCountdown';

type DepositCountdownProps = {
  deadline: Date | string | number;
  showLabel?: boolean;
};

function DepositCountdown({ deadline, showLabel = true }: DepositCountdownProps) {
  const { remaining } = useCountdown(deadline);

  return (
    <div className="flex items-center justify-center gap-1 rounded-lg bg-sky-blue-50 py-1.5 pr-3 pl-2.5 text-text-accent/88">
      <TimerIconFill className="size-5 text-sky-blue-400" />
      <p className="body-2-semibold">
        {remaining ?? '--:--:--'}
        {showLabel && ' 후 담기 종료'}
      </p>
    </div>
  );
}

export default DepositCountdown;
