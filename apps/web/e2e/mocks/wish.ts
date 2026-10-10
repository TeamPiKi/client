import type { GetWishResponseT } from '@/app/archive/wish/[id]/_types/wish';
import type { GetWishlistResponseT, PostWishLinkResponseT } from '@/types/wish';

import { MOCK_IMAGE_URLS } from './images';
import { MOCK_TOURNAMENT_ITEMS } from './tournament';

/**
 * by-wish 담기 spec 용 위시 4개.
 * item.id 를 토너먼트 목의 itemId 와 맞춰, 담기 후 pending.items 와 자연스럽게 이어지게 한다.
 */
export const MOCK_WISHLIST_ENTRIES: GetWishlistResponseT[] = MOCK_TOURNAMENT_ITEMS.map(
  (tournamentItem, index) => ({
    wish: { id: index + 1, createdAt: '2026-01-01T00:00:00Z' },
    item: {
      id: tournamentItem.itemId,
      status: 'READY',
      name: tournamentItem.name,
      price: tournamentItem.price,
      currency: 'KRW',
      imageUrl: MOCK_IMAGE_URLS.product,
      sourceUrl: null,
      sourcePlatform: null,
    },
    reused: null,
    refreshNeeded: null,
  })
);

export const MOCK_WISH_SOURCE_URL = 'https://shop.example/items/101';

export const MOCK_WISH_DETAIL: GetWishResponseT = {
  wish: { id: 1, createdAt: '2026-01-01T00:00:00Z' },
  memo: null,
  item: {
    id: 101,
    status: 'READY',
    name: 'E2E 스니커즈',
    price: 10000,
    currency: 'KRW',
    imageUrl: MOCK_IMAGE_URLS.product,
    sourceUrl: MOCK_WISH_SOURCE_URL,
    sourcePlatform: 'E2E몰',
    source: 'SERVER',
  },
  priceHistory: [],
};

export const MOCK_WISH_ADDED_BY_LINK: PostWishLinkResponseT = {
  wish: { id: 5, createdAt: '2026-01-02T00:00:00Z' },
  item: {
    id: 105,
    status: 'READY',
    name: 'E2E 코트',
    price: 50000,
    currency: 'KRW',
    imageUrl: MOCK_IMAGE_URLS.product,
    sourceUrl: 'https://shop.example/items/105',
    sourcePlatform: 'E2E몰',
  },
  refreshNeeded: false,
  reused: false,
};
