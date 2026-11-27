import type {
  GetExplorePicksResponseT,
  GetFriendWishesResponseT,
  GetRecentWishesResponseT,
} from '@/app/explore/_common/_types/explore';
import type { GetExploreFolderResponseT } from '@/app/explore/folder/[userId]/[folderId]/_types/exploreFolder';
import type { GetExplorePickResponseT } from '@/app/explore/pick/[pickId]/_types/explorePick';
import type { GetTournamentCandidatesResponseT } from '@/app/explore/winners/[pickId]/_types/candidate';
import type { GetExploreWishResponseT } from '@/app/explore/wish/[wishId]/_types/exploreWish';

import { MOCK_FRIEND_PIKI } from './friend';
import { MOCK_IMAGE_URLS } from './images';
import { MOCK_WISHLIST_ENTRIES } from './wish';

export const MOCK_FOLDER_OWNER_ID = '00000000-0000-4000-8000-000000000002';

export const MOCK_EXPLORE_FOLDER: GetExploreFolderResponseT = {
  folderId: 7,
  name: '겨울 대비',
  wishes: MOCK_WISHLIST_ENTRIES.slice(0, 2).map(({ wish, item }, index) => ({
    wishId: wish.id,
    saved: index === 0,
    item,
  })),
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

/** updatedAt 은 "N분 전 업데이트" 표시를 검증하려고 요청 시점 기준 5분 전으로 만든다 */
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

const [DETAIL_ENTRY] = MOCK_WISHLIST_ENTRIES;

export const MOCK_EXPLORE_WISH: GetExploreWishResponseT = {
  wishId: 501,
  addedAt: '2026-11-24T09:58:30+09:00',
  saved: false,
  savedUserCount: 12,
  item: { ...DETAIL_ENTRY!.item, sourceUrl: 'https://shop.example/products/501' },
  owner: {
    ...EXPLORE_FRIEND,
    relation: 'FRIEND',
    folder: { folderId: MOCK_EXPLORE_FOLDER.folderId, name: MOCK_EXPLORE_FOLDER.name },
  },
};

export const MOCK_PRIVATE_EXPLORE_WISH: GetExploreWishResponseT = {
  ...MOCK_EXPLORE_WISH,
  wishId: 502,
  owner: null,
};

const PICK_TOURNAMENT = { tournamentId: 51, name: '겨울 패딩 뭐 사지' };

export const MOCK_EXPLORE_PICKS: GetExplorePicksResponseT = {
  updatedAt: '2026-11-27T10:00:00+09:00',
  picks: [
    {
      pickId: 601,
      candidateId: 701,
      pickedAt: '2026-11-27T09:58:30+09:00',
      saved: false,
      tournament: PICK_TOURNAMENT,
      item: createExploreItem(921, '1위 패딩', 'musinsa'),
    },
    {
      pickId: 602,
      candidateId: 711,
      pickedAt: '2026-11-27T09:00:00+09:00',
      saved: true,
      tournament: { tournamentId: 52, name: '크리스마스 선물' },
      item: createExploreItem(922, '1위 머그컵', '29CM'),
    },
  ],
};

const [MAIN_PICK] = MOCK_EXPLORE_PICKS.picks;

export const MOCK_EXPLORE_PICK: GetExplorePickResponseT = {
  pickId: MAIN_PICK!.pickId,
  candidateId: MAIN_PICK!.candidateId,
  pickedAt: MAIN_PICK!.pickedAt,
  saved: false,
  savedUserCount: 3,
  item: MAIN_PICK!.item,
  picker: {
    ...EXPLORE_FRIEND,
    relation: 'FRIEND',
    folder: { folderId: MOCK_EXPLORE_FOLDER.folderId, name: MOCK_EXPLORE_FOLDER.name },
  },
  tournament: {
    ...PICK_TOURNAMENT,
    candidateCount: 3,
    candidateImageUrls: [
      MOCK_IMAGE_URLS.product,
      `${MOCK_IMAGE_URLS.product}?candidate=702`,
      `${MOCK_IMAGE_URLS.product}?candidate=703`,
    ],
  },
};

export const MOCK_EXPLORE_PICK_CANDIDATES: GetTournamentCandidatesResponseT = {
  pickId: MAIN_PICK!.pickId,
  tournament: PICK_TOURNAMENT,
  candidates: [
    { candidateId: 701, isPick: true, saved: false, item: MAIN_PICK!.item },
    {
      candidateId: 702,
      isPick: false,
      saved: true,
      item: createExploreItem(923, '후보 코트', null),
    },
    {
      candidateId: 703,
      isPick: false,
      saved: false,
      item: createExploreItem(924, '후보 점퍼', null),
    },
  ],
};
