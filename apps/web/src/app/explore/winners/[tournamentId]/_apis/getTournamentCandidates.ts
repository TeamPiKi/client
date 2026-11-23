import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/consts/queryKeys';

import { WINNER_WISHES_MOCK } from '../../../_common/_consts/exploreMock';
import type { GetTournamentCandidatesResponseT } from '../_types/candidate';

const CANDIDATE_COUNT = 12;
/** 1위를 앞으로 정렬하는지 확인할 수 있게 목데이터에서는 중간에 둠 */
const WINNER_INDEX = 3;

/** TEMP: API 스펙 확정 전이라 1위 위시 목데이터로 후보 목록 응답을 만들어 반환함 */
export const getTournamentCandidates = async (
  tournamentId: number
): Promise<GetTournamentCandidatesResponseT | null> => {
  const winnerWish = WINNER_WISHES_MOCK.find(wish => wish.tournament.id === tournamentId);
  if (!winnerWish) return null;

  return {
    tournament: winnerWish.tournament,
    candidates: Array.from({ length: CANDIDATE_COUNT }, (_, index) => {
      if (index === WINNER_INDEX) {
        return {
          wishId: winnerWish.wishId,
          item: { ...winnerWish.item, sourcePlatform: '29CM' },
          isWinner: true,
        };
      }

      return {
        wishId: tournamentId * 100 + index,
        item: {
          name: '상품명입니다.',
          price: 10000 * (index + 1),
          discountRate: index % 2 === 0 ? 10 : null,
          imageUrl: `https://picsum.photos/seed/piki-candidate-${tournamentId}-${index}/400`,
          sourcePlatform: 'Source',
        },
        isWinner: false,
      };
    }),
  };
};

export const tournamentCandidatesQueryOptions = (tournamentId: number) =>
  queryOptions({
    queryKey: QUERY_KEYS.EXPLORE.CANDIDATES(tournamentId),
    queryFn: () => getTournamentCandidates(tournamentId),
  });
