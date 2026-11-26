import type { ExploreFriendT, FriendWishT, RecentWishT, WinnerWishT } from '../_types/explore';

const TOURNAMENT_TITLES = ['만원이하 선물템', '크리스마스 선물', '겨울 아우터', '책상 꾸미기'];

/** TEMP: 탐색 API 연동 전 목데이터 */
export const WINNER_WISHES_MOCK: WinnerWishT[] = Array.from({ length: 45 }, (_, index) => ({
  wishId: index + 1,
  item: {
    name:
      index % 3 === 0
        ? `상품명입니다. 2줄 이상 길어지면 이렇게 보여요 ${index + 1}`
        : '상품명입니다.',
    price: 10000 * ((index % 10) + 1),
    discountRate: index % 2 === 0 ? (index % 9) * 10 + 9 : null,
    imageUrl: `https://picsum.photos/seed/piki-winner-${index + 1}/400`,
  },
  tournament: {
    id: index + 1,
    title: TOURNAMENT_TITLES[index % TOURNAMENT_TITLES.length] ?? '',
  },
}));

const SLEEPY_CAT: ExploreFriendT = {
  userId: 'friend-1',
  nickname: '잠자는 고양이',
  profileImage: 'https://picsum.photos/seed/piki-friend-1/80',
};
const GRAZING_LLAMA: ExploreFriendT = {
  userId: 'friend-2',
  nickname: '풀먹는 라마',
  profileImage: 'https://picsum.photos/seed/piki-friend-2/80',
};
const SLEEPY_MONKEY: ExploreFriendT = {
  userId: 'friend-3',
  nickname: '졸린 원숭이',
  profileImage: 'https://picsum.photos/seed/piki-friend-3/80',
};

const FRIENDS_MOCK: ExploreFriendT[] = [SLEEPY_CAT, GRAZING_LLAMA, SLEEPY_MONKEY];

/** TEMP: 친구가 담은 위시 API 연동 전 목데이터 */
export const FRIEND_WISHES_MOCK: FriendWishT[] = Array.from({ length: 30 }, (_, index) => ({
  wishId: index + 101,
  item: {
    name:
      index % 3 === 0
        ? `상품명입니다. 2줄 이상 길어지면 이렇게 보여요 ${index + 1}`
        : '상품명입니다.',
    price: 10000 * ((index % 10) + 1),
    discountRate: index % 2 === 0 ? (index % 9) * 10 + 9 : null,
    imageUrl: `https://picsum.photos/seed/piki-friend-wish-${index + 1}/400`,
  },
  friend: index % 3 === 1 ? GRAZING_LLAMA : SLEEPY_CAT,
}));

/** TEMP: 탐색 API 연동 전 목데이터 */
export const RECENT_WISHES_MOCK: (RecentWishT & { friend: ExploreFriendT | null })[] = Array.from(
  { length: 45 },
  (_, index) => ({
    wishId: 1000 + index + 1,
    item: {
      name:
        index % 3 === 0
          ? `상품명입니다. 2줄 이상 길어지면 이렇게 보여요 ${index + 1}`
          : '상품명입니다.',
      price: 10000 * ((index % 10) + 1),
      discountRate: index % 2 === 0 ? (index % 9) * 10 + 9 : null,
      imageUrl: `https://picsum.photos/seed/piki-recent-${index + 1}/400`,
      sourcePlatform: index % 4 === 3 ? null : 'Source',
    },
    savedAt: '',
    isInMyWish: index % 5 === 4,
    friend: index % 4 === 1 ? (FRIENDS_MOCK[index % FRIENDS_MOCK.length] ?? null) : null,
  })
);
