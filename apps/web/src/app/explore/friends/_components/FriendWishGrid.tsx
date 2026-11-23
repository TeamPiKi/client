'use client';

import Link from 'next/link';

import Basket from '@/components/common/basket';
import NextPageStatus from '@/components/common/next-page-status';
import { ROUTES } from '@/consts/route';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import { useGetFriendWishes } from '../../_common/_hooks/useGetFriendWishes';
import FriendWishGridCard from './FriendWishGridCard';

/** 이미지 preload 개수 */
const PRELOAD_COUNT = 4;

type FriendWishGridProps = {
  /** null 이면 전체 친구 */
  friendId: string | null;
};

function FriendWishGrid({ friendId }: FriendWishGridProps) {
  const {
    friendWishesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetFriendWishes(friendId);
  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage && !isFetching && !isFetchNextPageError
  );

  if (friendWishesData.length === 0) {
    return (
      <div role="status" className="flex flex-col items-center gap-[25px] px-5 pt-[100px]">
        <Basket type="panic" />
        <p className="text-center heading-1-semibold text-text-neutral-primary">
          아직 친구가 담은 위시가 없어요
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-2">
        {friendWishesData.map(({ wishId, item, friend }, index) => (
          <li key={wishId}>
            <Link href={ROUTES.EXPLORE_WISH(wishId)} className="block">
              <FriendWishGridCard item={item} friend={friend} preload={index < PRELOAD_COUNT} />
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

export default FriendWishGrid;
