'use client';

import { useEffect, useRef } from 'react';

import { useGetWishlist } from '@/hooks/useGetWishlist';
import { useSSEFallback } from '@/hooks/useSSEFallback';
import { hasParsingItems } from '@/utils/item';

import WishCardSkeleton from './WishCardSkeleton';
import WishlistTabContent from './WishlistTabContent';

type WishlistListProps = {
  isDeleteMode: boolean;
  selectedIds: Set<number>;
  onToggleSelect: (id: number) => void;
};

function WishlistList({ isDeleteMode, selectedIds, onToggleSelect }: WishlistListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { wishlistData, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetWishlist();
  const hasPendingItem = hasParsingItems(wishlistData);

  useSSEFallback(['wishlists'], hasPendingItem);

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
      <WishlistTabContent
        items={wishlistData}
        isDeleteMode={isDeleteMode}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
      />

      {isFetchingNextPage && (
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
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
