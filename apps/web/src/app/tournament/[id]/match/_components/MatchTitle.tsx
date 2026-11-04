import { cn } from '@/utils/cn';

const titleClassName =
  'text-center text-[22px] leading-8 font-bold tracking-[-0.6px] text-text-neutral-primary';
const transitionClassName =
  'transition-[opacity,translate] duration-400 ease-[cubic-bezier(.34,1.56,.64,1)] motion-reduce:transition-none';

type MatchTitleProps = {
  isFinal?: boolean;
  isPicked?: boolean;
};

function MatchTitle({ isFinal = false, isPicked = false }: MatchTitleProps) {
  return (
    <div className="relative">
      <h1
        className={cn(
          titleClassName,
          isPicked && [transitionClassName, '-translate-y-2.5 opacity-0']
        )}
      >
        {isFinal ? '최후의 선택을 받을 위시는?' : '내 마음을 움직이는 위시는?'}
      </h1>
      <p
        aria-live="polite"
        className={cn(
          titleClassName,
          'absolute inset-0',
          isPicked
            ? [transitionClassName, isFinal ? 'delay-150' : 'delay-100', 'opacity-100']
            : 'translate-y-2.5 opacity-0'
        )}
      >
        선택 완료!
      </p>
    </div>
  );
}

export default MatchTitle;
