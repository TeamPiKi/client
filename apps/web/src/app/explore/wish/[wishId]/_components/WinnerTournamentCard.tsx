import { ChevronForwardIconFill } from '@/assets/icons';
import BaseImage from '@/components/base-image';
import Basket from '@/components/common/basket';
import Skeleton from '@/components/skeleton';

import type { ExploreWishDetailT } from '../_types/exploreWish';

type WinnerTournamentCardProps = {
  tournament: NonNullable<ExploreWishDetailT['winnerTournament']>;
};

/** 위시가 1위를 차지한 토너먼트 */
function WinnerTournamentCard({ tournament }: WinnerTournamentCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-bg-layer-default p-4">
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Basket type="heart" className="size-[42px] shrink-0" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate body-1-semibold text-text-neutral-primary">{tournament.title}</p>
            <p className="caption-1-regular text-text-neutral-secondary">
              후보 {tournament.candidateCount}개 중 최종 선택
            </p>
          </div>
        </div>
        <ChevronForwardIconFill
          className="size-6.5 shrink-0 text-icon-neutral-secondary"
          aria-hidden
        />
      </div>

      <hr className="border-border-neutral-muted" />

      <div className="relative overflow-hidden">
        <ul className="flex gap-2">
          {tournament.candidateImageUrls.map(imageUrl => (
            <li key={imageUrl} className="relative size-[70px] shrink-0 overflow-hidden rounded-sm">
              <BaseImage
                src={imageUrl}
                alt=""
                sizes="70px"
                className="object-cover"
                loadingFallback={<Skeleton className="absolute inset-0 rounded-none" />}
              />
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[45px] bg-linear-to-r from-white/0 to-white" />
      </div>
    </div>
  );
}

export default WinnerTournamentCard;
