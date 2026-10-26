'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { MOCK_FOLDERS, MOCK_WISHES } from '@/app/wish/_common/_consts/wishMock';
import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import WishGrid from '@/components/common/wish-grid';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';

import { useGetTournament } from '../../../_common/_hooks/useGetTournament';
import { MAX_SELECT } from '../../by-wish/_consts/selectLimits';
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

  /** TEMP: 위시·폴더 API 연동 전까지 목 데이터 사용함 */
  const items = MOCK_WISHES;
  const folders = MOCK_FOLDERS;
  const activeFolder = folders.find(({ id }) => id === activeFolderId);
  const visibleItems = activeFolder
    ? items.filter(({ wish }) => activeFolder.wishIds.includes(wish.id))
    : items;

  const hasNoWish = items.length === 0;

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
        {folders.length > 0 && (
          <FolderChipFilter
            folders={folders}
            activeFolderId={activeFolderId}
            onFolderChange={setActiveFolderId}
          />
        )}
        <p className="px-5 body-2-medium text-[#737373]">
          <span className="text-text-accent">{selectedWishIds.size}</span>/{addableCount}개 선택
        </p>
      </div>

      <main className="hide-scrollbar flex flex-1 flex-col overflow-y-auto pb-32">
        <WishGrid
          wishes={visibleItems}
          selectedWishIds={selectedWishIds}
          onToggleSelect={handleToggleSelect}
        />
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
