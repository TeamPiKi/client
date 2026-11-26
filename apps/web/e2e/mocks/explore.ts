import type {
  GetFriendWishesResponseT,
  GetRecentWishesResponseT,
} from '@/app/explore/_common/_types/explore';
import type { GetExploreFolderResponseT } from '@/app/explore/folder/[userId]/[folderId]/_types/exploreFolder';

import { MOCK_FRIEND_PIKI } from './friend';
import { MOCK_IMAGE_URLS } from './images';
import { MOCK_WISHLIST_ENTRIES } from './wish';

export const MOCK_FOLDER_OWNER_ID = '00000000-0000-4000-8000-000000000002';

export const MOCK_EXPLORE_FOLDER: GetExploreFolderResponseT = {
  folderId: 7,
  name: '겨울 대비',
  wishes: MOCK_WISHLIST_ENTRIES.slice(0, 2).map(({ wish, item }) => ({ wishId: wish.id, item })),
};

const createExploreItem = (id: number, name: string, sourcePlatform: string | null) => ({
  id,
  name,
  price: 39000,
  originalPrice: 49000,
  discountRate: 20,
  currency: 'KRW',
  imageUrl: MOCK_IMAGE_URLS.product,
  sourceUrl: sourcePlatform ? `https://shop.example/products/${id}` : null,
  sourcePlatform,
});

const EXPLORE_FRIEND = {
  userId: MOCK_FRIEND_PIKI.userId,
  nickname: MOCK_FRIEND_PIKI.nickname,
  profileImage: MOCK_FRIEND_PIKI.profileImage,
};

const OTHER_EXPLORE_FRIEND = {
  userId: '00000000-0000-4000-8000-000000000003',
  nickname: '지은',
  profileImage: MOCK_IMAGE_URLS.avatar,
};

/** updatedAt 은 "N분전 업데이트" 표시를 검증하려고 요청 시점 기준 5분 전으로 만든다 */
export const createRecentWishes = (): GetRecentWishesResponseT => ({
  updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  wishes: [
    {
      wishId: 301,
      addedAt: '2026-11-24T09:58:30+09:00',
      saved: false,
      item: createExploreItem(901, '탐색 가디건', 'musinsa'),
    },
    {
      wishId: 302,
      addedAt: '2026-11-24T09:40:00+09:00',
      saved: true,
      item: createExploreItem(902, '이미지로 담은 머플러', null),
    },
  ],
});

export const MOCK_FRIEND_WISHES: GetFriendWishesResponseT = {
  friends: [EXPLORE_FRIEND, OTHER_EXPLORE_FRIEND],
  wishes: [
    {
      wishId: 401,
      addedAt: '2026-11-24T09:00:00+09:00',
      saved: false,
      item: createExploreItem(911, '친구의 니트', '29CM'),
      friend: EXPLORE_FRIEND,
    },
    {
      wishId: 402,
      addedAt: '2026-11-24T08:00:00+09:00',
      saved: false,
      item: createExploreItem(912, '다른 친구의 장갑', '29CM'),
      friend: OTHER_EXPLORE_FRIEND,
    },
  ],
};
