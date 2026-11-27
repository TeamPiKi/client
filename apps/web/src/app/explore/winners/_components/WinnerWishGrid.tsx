'use client';

import Link from 'next/link';

import NextPageStatus from '@/components/common/next-page-status';
import { ROUTES } from '@/consts/route';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { SCROLL_NAMESPACE, saveScrollAnchor } from '@/utils/scrollRestoration';

import PickHeartButton from '../../_common/_components/PickHeartButton';
import { useGetWinnerWishes } from '../../_common/_hooks/useGetWinnerWishes';
import WinnerWishGridCard from './WinnerWishGridCard';

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
  useScrollRestoration({ namespace: SCROLL_NAMESPACE.EXPLORE_WINNERS });

  return (
    <>
      <ul className="grid grid-cols-2">
        {winnerWishesData.map(({ pickId, candidateId, item, tournament, isInMyWish }, index) => (
          <li key={pickId} className="relative">
            <Link
              href={ROUTES.EXPLORE_PICK(pickId)}
              data-scroll-anchor-id={pickId}
              onClick={event =>
                saveScrollAnchor(
                  { namespace: SCROLL_NAMESPACE.EXPLORE_WINNERS },
                  event.currentTarget,
                  String(pickId)
                )
              }
              className="block"
            >
              <WinnerWishGridCard
                item={item}
                isWinner
                caption={tournament.title}
                preload={index < PRELOAD_COUNT}
              />
            </Link>
            <PickHeartButton pickId={pickId} candidateId={candidateId} isInMyWish={isInMyWish} />
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
