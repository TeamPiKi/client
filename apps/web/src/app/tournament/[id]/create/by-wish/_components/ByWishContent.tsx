'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { Header, HeaderIcon } from '@/components/header';
import TournamentErrorDialog from '@/components/tournament-error-dialog';
import { ITEM_STATUS } from '@/consts/item';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { useGetWishlist } from '@/hooks/useGetWishlist';

import { useGetTournament } from '../../../_common/_hooks/useGetTournament';
import { MAX_SELECT } from '../_consts/selectLimits';
import { usePostTournamentItemsByWish } from '../_hooks/usePostTournamentItemsByWish';
import useWishSelection from '../_hooks/useWishSelection';
import WishSelectCard from './WishSelectCard';
import WishSelectHeader from './WishSelectHeader';

type ByWishContentProps = {
  tournamentId: number;
};

const noop = () => {};

function ByWishContent({ tournamentId }: ByWishContentProps) {
  const backWithFallback = useBackWithFallback();
  const { selectedIds, isMaxExceeded, handleSelect } = useWishSelection(MAX_SELECT);
  const { wishlistData, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetWishlist();
  const { tournamentData } = useGetTournament(tournamentId);

  const pending = 'pending' in tournamentData ? tournamentData.pending : null;
  const { postTournamentItemsByWishMutation, isPostTournamentItemsByWishPending } =
    usePostTournamentItemsByWish(tournamentId, pending?.items.length ?? 0);

  const existingItemIds = new Set(pending?.items.map(i => i.itemId) ?? []);
  const items = wishlistData.filter(
    ({ item }) =>
      item.status !== ITEM_STATUS.FAILED &&
      item.status !== ITEM_STATUS.PROCESSING &&
      item.status !== ITEM_STATUS.INCOMPLETE &&
      !existingItemIds.has(item.id)
  );

  const isWishlistLoaded = !hasNextPage && !isFetchingNextPage;

  const hasNoWish = isWishlistLoaded && wishlistData.length === 0;
  const hasNoSelectableWish = isWishlistLoaded && !hasNoWish && items.length === 0;

  useEffect(() => {
    if (!isMaxExceeded) return;
    toast.warning(`최대 ${MAX_SELECT}개까지 상품을 담을 수 있어요.`);
  }, [isMaxExceeded]);

  // 위시에서 가져오기는 전체 목록 기준으로 카운트를 표시해야 하므로 마운트 시 전체 로드
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleNext = () => {
    const itemIds = items
      .filter(({ wish }) => selectedIds.includes(wish.id))
      .map(({ item }) => item.id);
    postTournamentItemsByWishMutation(itemIds);
  };

  const handleBackToCreate = () => backWithFallback(ROUTES.TOURNAMENT_CREATE(tournamentId));

  if (hasNoWish) {
    return (
      <div className="h-full bg-bg-layer-basement">
        <TournamentErrorDialog
          type="NO_WISH_EXISTS"
          open
          onOpenChange={noop}
          secondaryButtonText="돌아가기"
          onSecondaryClick={handleBackToCreate}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-bg-layer-basement pt-padding-top">
      <div className="px-5">
        <Header
          left={<HeaderIcon name="BACK" />}
          center={
            <h1 className="heading-1-bold text-text-neutral-primary">내 위시에서 가져오기</h1>
          }
        />
        <WishSelectHeader
          selectedCount={selectedIds.length}
          totalCount={items.length}
          tournamentCandidateCount={pending?.items.length ?? 0}
          isMaxExceeded={isMaxExceeded}
        />
      </div>

      <main className="mt-6 hide-scrollbar flex flex-1 flex-col overflow-y-auto pb-32">
        {hasNoSelectableWish ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4" role="status">
            <div className="flex flex-col items-center gap-2">
              <p className="heading-2-semibold text-text-neutral-primary">
                담을 수 있는 위시가 없어요
              </p>
              <p className="text-center body-1-medium text-text-neutral-tertiary">
                위시가 모두 후보에 담겨 있어요.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {items.map(({ wish, item }) => (
              <WishSelectCard
                key={wish.id}
                name={item.name}
                price={item.price}
                imageUrl={item.imageUrl}
                sourcePlatform={item.sourcePlatform}
                isSelected={selectedIds.includes(wish.id)}
                onSelect={() => handleSelect(wish.id)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomCta hasGradient>
        <Button
          variant="primary"
          size="lg"
          disabled={selectedIds.length === 0}
          isLoading={isPostTournamentItemsByWishPending}
          onClick={handleNext}
        >
          다음
        </Button>
      </BottomCta>
    </div>
  );
}

export default ByWishContent;
