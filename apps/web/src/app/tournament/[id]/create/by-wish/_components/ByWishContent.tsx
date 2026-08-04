'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import BottomCta from '@/components/bottom-cta';
import Button from '@/components/button';
import { Header, HeaderIcon } from '@/components/header';
import { useGetWishlist } from '@/hooks/useGetWishlist';

import { useGetTournament } from '../../../_common/_hooks/useGetTournament';
import { MAX_SELECT } from '../_consts/selectLimits';
import { usePostTournamentItemsByWish } from '../_hooks/usePostTournamentItemsByWish';
import useWishSelection from '../_hooks/useWishSelection';
import NoWishDialog from './NoWishDialog';
import WishSelectCard from './WishSelectCard';
import WishSelectHeader from './WishSelectHeader';

type ByWishContentProps = {
  tournamentId: number;
};

function ByWishContent({ tournamentId }: ByWishContentProps) {
  const router = useRouter();
  const { selectedIds, isMaxExceeded, handleSelect } = useWishSelection(MAX_SELECT);
  const { wishlistData, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetWishlist();
  const { tournamentData } = useGetTournament(tournamentId);
  const { postTournamentItemsByWishMutation, isPostTournamentItemsByWishPending } =
    usePostTournamentItemsByWish(tournamentId);

  const pending = 'pending' in tournamentData ? tournamentData.pending : null;
  const existingItemIds = new Set(pending?.items.map(i => i.itemId) ?? []);
  const items = wishlistData.filter(
    ({ item }) =>
      item.status !== 'FAILED' && item.status !== 'PROCESSING' && !existingItemIds.has(item.id)
  );

  /**
   * 가져올 위시가 하나도 없는 경우 — 위시가 아예 없거나, 남은 게 전부 이미 담겼거나 추출 실패/진행 중이다.
   * 전체 페이지를 다 받은 뒤에 판단해야 로딩 중 잘못 뜨지 않는다.
   */
  const hasNoSelectableWish = !hasNextPage && !isFetchingNextPage && items.length === 0;

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

      <NoWishDialog open={hasNoSelectableWish} onOpenChange={() => router.back()} />
    </div>
  );
}

export default ByWishContent;
