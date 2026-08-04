import { cn } from '@/utils/cn';

type OnboardingIndicatorProps = {
  totalCount: number;
  currentIndex: number;
  onSelect: (index: number) => void;
};

function OnboardingIndicator({ totalCount, currentIndex, onSelect }: OnboardingIndicatorProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: totalCount }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1}번째 슬라이드`}
          onClick={() => onSelect(i)}
          className={cn(
            'h-2 cursor-pointer rounded-full transition-all duration-300',
            i === currentIndex ? 'w-5 bg-icon-neutral-primary' : 'w-2 bg-icon-neutral-secondary'
          )}
        />
      ))}
    </div>
  );
}

export default OnboardingIndicator;
