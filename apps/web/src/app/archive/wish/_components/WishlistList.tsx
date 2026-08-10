'use client';

import { useEffect, useRef } from 'react';

import { useGetWishlist } from '@/hooks/useGetWishlist';
import { useSSEFallback } from '@/hooks/useSSEFallback';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { hasParsingItems } from '@/utils/item';
import { SCROLL_NAMESPACE } from '@/utils/scrollRestoration';

import WishCardSkeleton from './WishCardSkeleton';
import WishGridContent from './WishGridContent';

type WishlistListProps = {
  isDeleteMode: boolean;
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
};

function WishlistList({ isDeleteMode, selectedIds, onToggleSelect }: WishlistListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { wishlistData, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetWishlist();
  const hasPendingItem = hasParsingItems(wishlistData.map(({ item }) => item));

  useSSEFallback(['wishlists'], hasPendingItem);
  useScrollRestoration({ namespace: SCROLL_NAMESPACE.ARCHIVE_WISH });

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <WishGridContent
        items={wishlistData}
        isDeleteMode={isDeleteMode}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
      />

      {isFetchingNextPage && (
        <div className="grid grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <WishCardSkeleton key={index} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} />
    </>
  );
}

export default WishlistList;
