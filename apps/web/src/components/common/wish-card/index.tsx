import { ITEM_STATUS } from '@/consts/item';
import type { ItemStatusT } from '@/types/item';

import WishFailedCard from './WishFailedCard';
import WishIncompleteCard from './WishIncompleteCard';
import WishProcessingCard from './WishProcessingCard';
import WishReadyCard from './WishReadyCard';

type WishCardProps = {
  status: ItemStatusT;
  name: string | null;
  price: number | null;
  imageUrl: string | null;
  sourcePlatform?: string | null;
  preload?: boolean;
};

/** 위시 카드 — 파싱 상태에 맞는 카드를 고른다 */
function WishCard({ status, ...readyProps }: WishCardProps) {
  switch (status) {
    case ITEM_STATUS.PENDING:
    case ITEM_STATUS.PROCESSING:
      return <WishProcessingCard />;
    case ITEM_STATUS.FAILED:
      return <WishFailedCard />;
    case ITEM_STATUS.INCOMPLETE:
      return <WishIncompleteCard />;
    case ITEM_STATUS.READY:
      return <WishReadyCard {...readyProps} />;
  }
}

export default WishCard;
