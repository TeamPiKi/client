import { Z_INDEX } from '@/consts/zIndex';
import { cn } from '@/utils/cn';

type BottomCtaProps = {
  className?: string;
  hasGradient?: boolean;
  children: React.ReactNode;
};

function BottomCta({ className, hasGradient = false, children }: BottomCtaProps) {
  return (
    <div
      className={cn(
        'fixed right-0 bottom-0 left-0 mx-auto flex w-full max-w-120 items-center gap-2.5 bg-bg-layer-basement px-5 pt-3 pb-8',
        className
      )}
      style={{ zIndex: Z_INDEX.BOTTOM_CTA }}
    >
      {hasGradient && (
        <div
          className="pointer-events-none absolute left-0 h-9 w-full"
          style={{
            bottom: 'calc(100% - 1px)',
            background:
              'linear-gradient(180deg, rgba(244, 244, 246, 0) 0%, var(--color-bg-layer-basement) 100%)',
          }}
        />
      )}
      {children}
    </div>
  );
}

export default BottomCta;
