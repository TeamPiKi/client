import { cn } from '@/utils/cn';

type TournamentItemBasketStatusProps = {
  isProcessing: boolean;
  count: number;
};

function TournamentItemBasketStatus({ isProcessing, count }: TournamentItemBasketStatusProps) {
  const label = (() => {
    if (isProcessing) return '담는 중...';
    if (count === 0) return '후보를 장바구니에 담아보세요';
    if (count < 2) return '최소 2개 이상 담아주세요';
    return `${count}/32`;
  })();

  const isBlue = count < 2;

  return (
    <div className="flex items-center justify-center">
      <span
        className={cn(
          'inline-flex h-10 items-center rounded-3xl border px-3 body-2-regular',
          isBlue && 'border-sky-blue-100 bg-sky-blue-50 text-text-accent',
          !isBlue && 'border-gray-100 bg-gray-75 text-gray-600'
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default TournamentItemBasketStatus;
