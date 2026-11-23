'use client';

import Link from 'next/link';

import NextPageStatus from '@/components/common/next-page-status';
import { ROUTES } from '@/consts/route';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import WinnerWishCard from '../../_common/_components/WinnerWishCard';
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
            <Link href={ROUTES.EXPLORE_WISH(wishId)} className="block">
              <WinnerWishCard
                item={item}
                variant="grid"
                isWinner
                caption={tournament.title}
                preload={index < PRELOAD_COUNT}
              />
            </Link>
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
