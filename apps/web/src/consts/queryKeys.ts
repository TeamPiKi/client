import type { GetTournamentListRequestT } from '@/types/tournament';

export const QUERY_KEYS = {
  /** 유저 */
  USER: {
    /** 내 정보 */
    ME: ['me'] as const,
  },
  /** 알림 */
  NOTIFICATION: {
    /** 알림 히스토리 목록 */
    LIST: ['notifications'] as const,
  },
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
