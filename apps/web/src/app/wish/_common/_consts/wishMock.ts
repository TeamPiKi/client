import { ITEM_STATUS } from '@/consts/item';

import type { WishFolderT, WishListItemT } from '../_types/wish';

// TEMP: API 연동 시 public/mock/wish 이미지와 함께 제거
const MOCK_IMAGE_URLS = [1, 2, 3, 4, 5, 6].map(index => `/mock/wish/wish-${index}.jpg`);

export const MOCK_WISHES: WishListItemT[] = Array.from({ length: 12 }, (_, index) => ({
  wish: { id: index + 1, createdAt: '2026-10-14T00:00:00' },
  item: {
    id: index + 1,
    status: ITEM_STATUS.READY,
    name:
      index % 3 === 1 ? '상품명입니다.' : '상품명입니다.\n2줄 이상 길어지면 이렇게 말줄임 처리돼요',
    price: 100000,
    currency: 'KRW',
    imageUrl: MOCK_IMAGE_URLS[index % MOCK_IMAGE_URLS.length] ?? null,
    sourceUrl: null,
    sourcePlatform: 'BRAND',
    discountRate: index % 4 === 3 ? null : 99,
  },
  refreshNeeded: null,
  reused: null,
}));

export const MOCK_FOLDERS: WishFolderT[] = [
  { id: 1, name: '가방 위시템', wishIds: [4, 1, 2, 3, 5, 6] },
];
