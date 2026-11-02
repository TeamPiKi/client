'use client';

import WishGrid from '@/components/common/wish-grid';
import { ITEM_STATUS } from '@/consts/item';
import { useGetWishes } from '@/hooks/useGetWishes';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { useSSEFallback } from '@/hooks/useSSEFallback';

import type { AllWishTabContentProps } from '../_types/wishTab';
import WishAddCard from './WishAddCard';

function AllWishTabContent(props: AllWishTabContentProps) {
  const isEditMode = Boolean(props.selectedWishIds);

  const { wishesData, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetWishes();
  const hasPendingItem = wishesData.some(
    ({ item }) => item.status === ITEM_STATUS.PARSING || item.refreshing
  );

  useSSEFallback(['wishlists'], hasPendingItem);
  const bottomRef = useIntersectionObserver(fetchNextPage, hasNextPage && !isFetchingNextPage);

  /** TODO: 위시 상세 링크 연결 시 saveScrollAnchor·useScrollRestoration(scope: all) 추가 */
  return (
    <>
      <WishGrid {...props} wishes={wishesData} leadingItem={!isEditMode && <WishAddCard />} />
      <div ref={bottomRef} />
    </>
  );
}

export default AllWishTabContent;
