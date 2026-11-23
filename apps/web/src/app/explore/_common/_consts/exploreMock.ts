import type { WinnerWishT } from '../_types/explore';

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
