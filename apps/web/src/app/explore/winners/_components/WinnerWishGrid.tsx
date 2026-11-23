'use client';

import NextPageStatus from '@/components/common/next-page-status';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import ExploreWishCard from '../../_common/_components/ExploreWishCard';
import { useGetWinnerWishes } from '../../_common/_hooks/useGetWinnerWishes';

/** 이미지 preload 개수 */
const PRELOAD_COUNT = 4;

function WinnerWishGrid() {
  const {
    winnerWishesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetWinnerWishes();
  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage && !isFetching && !isFetchNextPageError
  );

  return (
    <>
      <ul className="grid grid-cols-2">
        {winnerWishesData.map(({ wishId, item, tournament }, index) => (
          <li key={wishId}>
            <ExploreWishCard
              item={item}
              variant="grid"
              isWinner
              caption={tournament.title}
              preload={index < PRELOAD_COUNT}
            />
          </li>
        ))}
      </ul>
      <NextPageStatus
        ref={bottomRef}
        isFetching={isFetchingNextPage}
        isError={isFetchNextPageError}
        onRetry={fetchNextPage}
      />
    </>
  );
}

export default WinnerWishGrid;
