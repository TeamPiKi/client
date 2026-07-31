import type { ItemT } from '@/types/item';
import type { WishT } from '@/types/wish';

import { MOCK_IMAGE_URLS } from './images';
import { MOCK_TOURNAMENT_ITEMS } from './tournament';

/** getWishlist 원 응답의 data 항목 형태 (apis/getWishlist.ts 의 WishlistEntryT 와 동일) */
type WishlistEntryT = {
  wish: WishT;
  item: ItemT;
};

/**
 * by-wish 담기 spec 용 위시 4개.
 * item.id 를 토너먼트 목의 itemId 와 맞춰, 담기 후 pending.items 와 자연스럽게 이어지게 한다.
 */
export const MOCK_WISHLIST_ENTRIES: WishlistEntryT[] = MOCK_TOURNAMENT_ITEMS.map(
  (tournamentItem, index) => ({
    wish: { id: index + 1, createdAt: '2026-01-01T00:00:00Z' },
    item: {
      id: tournamentItem.itemId,
      status: 'READY',
      name: tournamentItem.name,
      currentPrice: tournamentItem.price,
      currency: 'KRW',
      imageUrl: MOCK_IMAGE_URLS.product,
      sourceUrl: null,
      sourcePlatform: null,
    },
  })
);
