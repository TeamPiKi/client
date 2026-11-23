'use client';

import Link from 'next/link';

import NextPageStatus from '@/components/common/next-page-status';
import { ROUTES } from '@/consts/route';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

import { useGetRecentWishes } from '../_hooks/useGetRecentWishes';
import ExploreSectionHeader from './ExploreSectionHeader';
import RecentWishGridCard from './RecentWishGridCard';
import WishHeartButton from './WishHeartButton';

const MINUTE_MS = 60 * 1000;

/** TEMP: 업데이트 기준 시각이 API 스펙에 없어 가장 최근 위시가 담긴 시각으로 계산함 */
const formatUpdatedAgo = (savedAt: string) => {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(savedAt).getTime()) / MINUTE_MS));
  if (minutes < 60) return `${minutes}분전 업데이트`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}시간전 업데이트`;
  return `${Math.floor(minutes / (60 * 24))}일전 업데이트`;
};

function RecentWishSection() {
  const {
    recentWishesData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetRecentWishes();
  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage && !isFetching && !isFetchNextPageError
  );
  const latestWish = recentWishesData[0];

  if (!latestWish) return null;

  return (
    <section className="flex flex-col gap-4">
      <ExploreSectionHeader
        title="방금 담긴 위시"
        description={formatUpdatedAgo(latestWish.savedAt)}
      />
      <ul className="grid grid-cols-2">
        {recentWishesData.map(({ wishId, item, isInMyWish, friend }) => (
          <li key={wishId} className="relative">
            <Link href={ROUTES.EXPLORE_WISH(wishId)} className="block">
              <RecentWishGridCard item={item} friend={friend} />
            </Link>
            <WishHeartButton wishId={wishId} isInMyWish={isInMyWish} />
          </li>
        ))}
      </ul>
      <NextPageStatus
        ref={bottomRef}
        isFetching={isFetchingNextPage}
        isError={isFetchNextPageError}
        onRetry={fetchNextPage}
      />
    </section>
  );
}

export default RecentWishSection;
