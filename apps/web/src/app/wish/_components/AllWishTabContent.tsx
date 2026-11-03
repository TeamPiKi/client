'use client';

import WishGrid from '@/components/common/wish-grid';
import { ITEM_STATUS } from '@/consts/item';
import { useGetWishes } from '@/hooks/useGetWishes';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { useSSEFallback } from '@/hooks/useSSEFallback';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { SCROLL_NAMESPACE } from '@/utils/scrollRestoration';

import { WISH_TAB } from '../_consts/wishTab';
import type { AllWishTabContentProps } from '../_types/wishTab';
import WishAddCard from './WishAddCard';

const SCROLL_RESTORATION = { namespace: SCROLL_NAMESPACE.WISHLIST, scope: WISH_TAB.ALL };

function AllWishTabContent(props: AllWishTabContentProps) {
  const isEditMode = Boolean(props.selectedWishIds);

  const { wishesData, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetWishes();
  const hasPendingItem = wishesData.some(
    ({ item }) => item.status === ITEM_STATUS.PARSING || item.refreshing
  );

  useSSEFallback(['wishlists'], hasPendingItem);
  useScrollRestoration(SCROLL_RESTORATION);
  const bottomRef = useIntersectionObserver(fetchNextPage, hasNextPage && !isFetchingNextPage);

  return (
    <>
      <WishGrid
        {...props}
        wishes={wishesData}
        leadingItem={!isEditMode && <WishAddCard />}
        scrollRestoration={SCROLL_RESTORATION}
      />
      <div ref={bottomRef} />
    </>
  );
}

export default AllWishTabContent;
