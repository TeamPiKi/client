import CircularSpinnerIcon from './circular-spinner.svg';
import type { SpinnerProps } from './spinner.type';

/** 원형 로딩 — 로드 시간이 짧은 일반적인 상황에 쓴다 */
function CircularSpinner({
  size = 28,
  timing = 1,
  color = 'var(--color-sky-blue-400)',
}: SpinnerProps) {
  return (
    <CircularSpinnerIcon
      width={size}
      height={size}
      className="animate-spin"
      style={{ color, animationDuration: `${timing}s` }}
    />
  );
}

export default CircularSpinner;
