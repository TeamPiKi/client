import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/consts/queryKeys';

import { WINNER_WISHES_MOCK } from '../../../_common/_consts/exploreMock';
import type { ExploreWishDetailT } from '../../../_common/_types/explore';

/** TEMP: API 스펙 확정 전이라 1위 위시 목데이터로 상세 응답을 만들어 반환함 */
export const getExploreWish = async (wishId: number): Promise<ExploreWishDetailT | null> => {
  const winnerWish = WINNER_WISHES_MOCK.find(wish => wish.wishId === wishId);
  if (!winnerWish) return null;

  const { item, tournament } = winnerWish;

  return {
    wishId,
    item: {
      name: item.name,
      price: item.price ?? 0,
      discountRate: item.discountRate,
      imageUrl: item.imageUrl ?? '',
      sourceUrl: 'https://29cm.onelink.me',
    },
    isInMyWish: wishId % 4 === 0,
    savedCount: (wishId % 7) + 1,
    owner: {
      userId: String(wishId),
      nickname: '난폭한 북극곰',
      profileImage: `https://picsum.photos/seed/piki-owner-${wishId}/80`,
      isFriend: wishId % 3 === 0,
    },
    folder: wishId % 2 === 0 ? { id: wishId, name: '11월 위시리스트' } : null,
    winnerTournament: {
      id: tournament.id,
      title: tournament.title,
      candidateCount: 12,
      candidateImageUrls: Array.from(
        { length: 6 },
        (_, index) => `https://picsum.photos/seed/piki-candidate-${tournament.id}-${index}/140`
      ),
    },
  };
};

export const exploreWishQueryOptions = (wishId: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.EXPLORE.WISH(wishId),
    queryFn: () => getExploreWish(wishId),
  });
