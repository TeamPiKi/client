import type { GetTournamentListRequestT } from '@/types/tournament';

export const QUERY_KEYS = {
  /** 토너먼트 */
  TOURNAMENT: {
    /** 토너먼트 리스트 */
    LIST: {
      ALL: ['tournamentList'] as const,
      BY_PARAMS: (params: GetTournamentListRequestT) =>
        [...QUERY_KEYS.TOURNAMENT.LIST.ALL, params] as const,
    },
  },
};
