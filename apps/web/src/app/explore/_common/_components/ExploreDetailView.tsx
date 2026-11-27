import BaseImage from '@/components/base-image';
import { ItemLinkBanner } from '@/components/common/item-info-screen';
import Skeleton from '@/components/skeleton';
import { Z_INDEX } from '@/consts/zIndex';

import type { ExploreDetailViewT } from '../_types/explore';
import PrivateOwnerCard from './PrivateOwnerCard';
import WinnerChip from './WinnerChip';
import WinnerTournamentCard from './WinnerTournamentCard';
import WishItemInfoCard from './WishItemInfoCard';
import WishOwnerCard from './WishOwnerCard';

type ExploreDetailViewProps = {
  detail: ExploreDetailViewT;
  /** 하단 [내 위시로 담기] */
  cta: React.ReactNode;
};

/** 탐색 위시 상세·1위 상세 공통 화면 */
function ExploreDetailView({ detail, cta }: ExploreDetailViewProps) {
  const { item, savedCount, owner, folder, winnerTournament } = detail;

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

      {cta}
    </div>
  );
}

export default ExploreDetailView;
