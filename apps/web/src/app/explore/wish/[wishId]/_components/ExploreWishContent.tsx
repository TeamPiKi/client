'use client';

import { notFound } from 'next/navigation';

import BaseImage from '@/components/base-image';
import { ItemLinkBanner } from '@/components/common/item-info-screen';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';

import WinnerChip from '../../../_common/_components/WinnerChip';
import { useGetExploreWish } from '../_hooks/useGetExploreWish';
import AddToMyWishButton from './AddToMyWishButton';
import PrivateOwnerCard from './PrivateOwnerCard';
import WinnerTournamentCard from './WinnerTournamentCard';
import WishItemInfoCard from './WishItemInfoCard';
import WishOwnerCard from './WishOwnerCard';

type ExploreWishContentProps = {
  wishId: number;
};

function ExploreWishContent({ wishId }: ExploreWishContentProps) {
  const { exploreWishData } = useGetExploreWish(wishId);

  /** 레이아웃이 없는 위시를 걸러 내지만 타입상 null 이 남아 한 번 더 막음 */
  if (!exploreWishData) notFound();

  const { item, isInMyWish, savedCount, owner, folder, winnerTournament } = exploreWishData;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        <BaseImage
          src={item.imageUrl}
          alt={item.name}
          sizes="(max-width: 480px) calc(100vw - 40px), 440px"
          preload
          className="object-cover"
          loadingFallback={<Skeleton className="absolute inset-0 rounded-none" />}
        />
        {winnerTournament && (
          <WinnerChip
            size="lg"
            className="absolute top-0 left-0 rounded-tl-xl"
            style={{ zIndex: Z_INDEX.BASE_IMAGE + 1 }}
          />
        )}
        {item.sourceUrl && <ItemLinkBanner sourceUrl={item.sourceUrl} />}
      </div>

      <WishItemInfoCard
        name={item.name}
        price={item.price}
        discountRate={item.discountRate}
        savedCount={savedCount}
      />
      {owner ? <WishOwnerCard owner={owner} folder={folder} /> : <PrivateOwnerCard />}
      {winnerTournament && <WinnerTournamentCard tournament={winnerTournament} />}

      <AddToMyWishButton wishId={wishId} isInMyWish={isInMyWish} />
    </div>
  );
}

export default ExploreWishContent;
