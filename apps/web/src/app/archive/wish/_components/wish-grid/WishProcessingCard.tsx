import Spinner from '@/components/spinner';

function WishProcessingCard() {
  return (
    <div className="flex aspect-[0.765] flex-col items-center justify-center gap-3 rounded-xl bg-black/5 p-4">
      <Spinner size={32} />
      <p className="body-2-semibold text-text-neutral-secondary">상품을 담는중...</p>
    </div>
  );
}

export default WishProcessingCard;
