import Image from 'next/image';

import ProductImage from '@/app/tournament/[id]/create/_components/product-image';
import { Z_INDEX } from '@/consts/zIndex';
import { useGetMe } from '@/hooks/useGetMe';
import { cn } from '@/utils/cn';

import type { TournamentPendingItemT } from '../../../_common/_types/tournamentResponse';

type TournamentBasketItemProps = {
  item: TournamentPendingItemT;
  index: number;
  onClick?: () => void;
  participantImageMap?: Map<string, string>;
};

function TournamentBasketItem({
  item,
  index,
  onClick,
  participantImageMap,
}: TournamentBasketItemProps) {
  const { userData } = useGetMe();
  const friendImageUrl =
    item.userId && item.userId !== userData.id ? participantImageMap?.get(item.userId) : null;

  return (
    <div
      className={cn(
        'relative aspect-square w-full',
        (item.status === 'READY' || item.status === 'FAILED') && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <ProductImage
          {...(item.imageUrl ? { src: item.imageUrl } : {})}
          size="sm"
          fill
          alt={`토너먼트 아이템 ${index + 1}`}
          parsingStatus={item.status}
        />
      </div>
      {friendImageUrl && (
        <div
          className="absolute -right-1 -bottom-0.5 overflow-hidden rounded-full border-2 border-white"
          style={{ width: '35%', height: '35%', zIndex: Z_INDEX.BASE_IMAGE + 10 }}
        >
          <Image src={friendImageUrl} alt="친구 프로필" fill className="object-cover" />
        </div>
      )}
    </div>
  );
}

export default TournamentBasketItem;
