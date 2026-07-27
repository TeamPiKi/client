import Spinner from '@/components/spinner';

function WishProcessingCard() {
  return (
    <div className="relative flex flex-col bg-black/5">
      <div className="aspect-[201/166] w-full" />
      <div className="h-[124px]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
        <Spinner size={32} />
        <p className="body-2-semibold text-text-neutral-secondary">상품을 담는중...</p>
      </div>
    </div>
  );
}

export default WishProcessingCard;
