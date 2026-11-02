'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import WishGrid from '@/components/common/wish-grid';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { useGetFolders } from '@/hooks/useGetFolders';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import { useGetTournament } from '../../../_common/_hooks/useGetTournament';
import { MAX_SELECT } from '../../by-wish/_consts/selectLimits';
import { useFolderWishes } from '../_hooks/useFolderWishes';
import FolderChipFilter from './FolderChipFilter';
import NoWishDialog from './NoWishDialog';

type ByWishV2ContentProps = {
  tournamentId: number;
};

function ByWishV2Content({ tournamentId }: ByWishV2ContentProps) {
  const backWithFallback = useBackWithFallback();
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
  const [selectedWishIds, setSelectedWishIds] = useState<Set<number>>(new Set());
  const { tournamentData } = useGetTournament(tournamentId);

  const pending = 'pending' in tournamentData ? tournamentData.pending : null;
  const addableCount = Math.max(MAX_SELECT - (pending?.items.length ?? 0), 0);
  const isOverSelectionLimit = selectedWishIds.size > addableCount;

  const { foldersData } = useGetFolders();
  const { allWishesData, wishesData, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFolderWishes(activeFolderId);
  const bottomRef = useIntersectionObserver(fetchNextPage, hasNextPage && !isFetchingNextPage);

  const hasNoWish = allWishesData.length === 0;

  const handleToggleSelect = (wishId: number) => {
    const isSelected = selectedWishIds.has(wishId);
    if (!isSelected && selectedWishIds.size >= addableCount) {
      toast.warning(`최대 ${addableCount}개까지 상품을 담을 수 있어요.`, { id: 'max-select' });
      return;
    }

    setSelectedWishIds(prev => {
      const next = new Set(prev);
      if (isSelected) next.delete(wishId);
      else next.add(wishId);
      return next;
    });
  };

  const handleBackToCreate = () => backWithFallback(ROUTES.TOURNAMENT_CREATE(tournamentId));

  if (hasNoWish) return <NoWishDialog onBack={handleBackToCreate} />;

  return (
    <>
      <div className="flex flex-col gap-6 bg-bg-layer-default py-6">
        {foldersData.length > 0 && (
          <FolderChipFilter
            folders={foldersData}
            activeFolderId={activeFolderId}
            onFolderChange={setActiveFolderId}
          />
        )}
        <p className="px-5 body-2-medium text-[#737373]">
          <span className="text-text-accent">{selectedWishIds.size}</span>/{addableCount}개 선택
        </p>
      </div>

      <main className="hide-scrollbar flex flex-1 flex-col overflow-y-auto bg-bg-layer-basement pb-32">
        <WishGrid
          wishes={wishesData}
          selectedWishIds={selectedWishIds}
          onToggleSelect={handleToggleSelect}
        />
        <div ref={bottomRef} />
      </main>

      <BottomCta hasGradient>
        <Button
          variant="primary"
          size="lg"
          disabled={selectedWishIds.size === 0 || isOverSelectionLimit}
          /** TODO: 위시에서 토너먼트 후보 담기 API 연결 */
          onClick={handleBackToCreate}
        >
          다음
        </Button>
      </BottomCta>
    </>
  );
}

export default ByWishV2Content;
