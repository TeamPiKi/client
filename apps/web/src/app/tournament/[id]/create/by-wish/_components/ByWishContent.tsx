'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import WishGrid from '@/components/common/wish-grid';
import { Header, HeaderIcon } from '@/components/header';
import { ITEM_STATUS } from '@/consts/item';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { useGetFolders } from '@/hooks/useGetFolders';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import { useGetTournament } from '../../../_common/_hooks/useGetTournament';
import { MAX_SELECT } from '../_consts/selectLimits';
import { useFolderWishes } from '../_hooks/useFolderWishes';
import { usePostTournamentItemsByWish } from '../_hooks/usePostTournamentItemsByWish';
import FolderChipFilter from './FolderChipFilter';
import NoWishDialog from './NoWishDialog';

type ByWishContentProps = {
  tournamentId: number;
};

function ByWishContent({ tournamentId }: ByWishContentProps) {
  const backWithFallback = useBackWithFallback();
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
  /** 칩을 오가며 고른 위시도 담을 수 있게 wishId 와 itemId 를 함께 들고 있음 */
  const [selectedItemIds, setSelectedItemIds] = useState<Map<number, number>>(new Map());
  const { tournamentData } = useGetTournament(tournamentId);

  const pending = 'pending' in tournamentData ? tournamentData.pending : null;
  const existingItemCount = pending?.items.length ?? 0;
  const existingItemIds = new Set(pending?.items.map(({ itemId }) => itemId));
  const addableCount = Math.max(MAX_SELECT - existingItemCount, 0);
  const isOverSelectionLimit = selectedItemIds.size > addableCount;

  const { foldersData } = useGetFolders();
  const { allWishesData, wishesData, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFolderWishes(activeFolderId);
  const bottomRef = useIntersectionObserver(fetchNextPage, hasNextPage && !isFetchingNextPage);

  const { postTournamentItemsByWishMutation, isPostTournamentItemsByWishPending } =
    usePostTournamentItemsByWish(tournamentId, existingItemCount);

  const selectableWishes = wishesData.filter(
    ({ item }) =>
      item.status === ITEM_STATUS.READY && item.id !== null && !existingItemIds.has(item.id)
  );
  const hasNoWish = allWishesData.length === 0;
  const hasNoSelectableWish = !hasNextPage && selectableWishes.length === 0;

  const handleToggleSelect = (wishId: number) => {
    const isSelected = selectedItemIds.has(wishId);
    if (!isSelected && selectedItemIds.size >= addableCount) {
      toast.warning(`최대 ${addableCount}개까지 상품을 담을 수 있어요.`, { id: 'max-select' });
      return;
    }

    const itemId = selectableWishes.find(({ wish }) => wish.id === wishId)?.item.id;
    setSelectedItemIds(prev => {
      const next = new Map(prev);
      if (isSelected) next.delete(wishId);
      else if (typeof itemId === 'number') next.set(wishId, itemId);
      return next;
    });
  };

  const handleNext = () => postTournamentItemsByWishMutation(Array.from(selectedItemIds.values()));

  const handleBackToCreate = () => backWithFallback(ROUTES.TOURNAMENT_CREATE(tournamentId));

  if (hasNoWish) return <NoWishDialog onBack={handleBackToCreate} />;

  return (
    <div className="flex h-full flex-col bg-bg-layer-default">
      <div className="px-5 pt-padding-top">
        <Header
          left={<HeaderIcon name="BACK" />}
          center={
            <h1 className="heading-1-bold text-text-neutral-primary">내 위시에서 가져오기</h1>
          }
        />
      </div>

      <div className="flex flex-col gap-6 bg-bg-layer-default py-6">
        {foldersData.length > 0 && (
          <FolderChipFilter
            folders={foldersData}
            activeFolderId={activeFolderId}
            onFolderChange={setActiveFolderId}
          />
        )}
        <p className="px-5 body-2-medium text-[#737373]">
          <span className="text-text-accent">{selectedItemIds.size}</span>/{addableCount}개 선택
        </p>
      </div>

      <main className="hide-scrollbar flex flex-1 flex-col overflow-y-auto bg-bg-layer-basement pb-32">
        {hasNoSelectableWish ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2" role="status">
            <p className="heading-2-semibold text-text-neutral-primary">
              담을 수 있는 위시가 없어요
            </p>
            {activeFolderId === null && (
              <p className="text-center body-1-medium text-text-neutral-tertiary">
                위시가 모두 후보에 담겨 있어요.
              </p>
            )}
          </div>
        ) : (
          <WishGrid
            wishes={selectableWishes}
            selectedWishIds={new Set(selectedItemIds.keys())}
            onToggleSelect={handleToggleSelect}
          />
        )}
        <div ref={bottomRef} />
      </main>

      <BottomCta hasGradient>
        <Button
          variant="primary"
          size="lg"
          disabled={selectedItemIds.size === 0 || isOverSelectionLimit}
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
