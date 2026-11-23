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
  /** 탐색 */
  EXPLORE: {
    /** 토너먼트 1위 위시 목록 */
    WINNERS: ['explore', 'winners'] as const,
    FRIEND_WISHES: (friendId: string | null) => ['explore', 'friend-wishes', friendId] as const,
    FRIENDS: ['explore', 'friends'] as const,
    /** 1위 위시가 나온 토너먼트의 후보 목록 */
    CANDIDATES: (tournamentId: number) => ['explore', 'candidates', tournamentId] as const,
    /** 탐색 위시 상세 */
    WISH: (wishId: number) => ['explore', 'wish', wishId] as const,
  },
};
