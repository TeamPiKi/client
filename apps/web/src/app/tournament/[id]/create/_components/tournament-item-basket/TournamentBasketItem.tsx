import Image from 'next/image';
import type { ComponentProps } from 'react';

import { Z_INDEX } from '@/consts/zIndex';
import { useGetMe } from '@/hooks/useGetMe';
import { cn } from '@/utils/cn';

import type { PendingTournamentItemT } from '../../../_common/_types/tournamentResponse';
import ProductImage from './ProductImage';

type TournamentBasketItemProps = ComponentProps<'div'> & {
  item: PendingTournamentItemT;
  index: number;
  participantImageMap?: Map<string, string>;
};

/** 바스켓 타일. `DialogTrigger asChild` 로 감쌀 수 있도록 나머지 props(onClick·ref·aria)는 루트 div 에 전달한다 */
function TournamentBasketItem({
  item,
  index,
  participantImageMap,
  className,
  onClick,
  ...props
}: TournamentBasketItemProps) {
  const { userData } = useGetMe();
  const friendImageUrl =
    item.userId && item.userId !== userData.id ? participantImageMap?.get(item.userId) : null;

  return (
    <div
      className={cn('relative aspect-square w-full', onClick && 'cursor-pointer', className)}
      onClick={onClick}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <ProductImage
          {...(item.imageUrl ? { src: item.imageUrl } : {})}
          alt={`토너먼트 아이템 ${index + 1}`}
          status={item.status}
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
