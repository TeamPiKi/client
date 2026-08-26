import Spinner from '@/components/spinner';

import WishStatusFrame from './WishStatusFrame';

/** PENDING·PROCESSING 위시 카드 */
function WishProcessingCard() {
  return (
    <WishStatusFrame>
      <Spinner size={32} />
      <p className="body-2-semibold text-text-neutral-secondary">상품을 담는중...</p>
    </WishStatusFrame>
  );
}

export default WishProcessingCard;
