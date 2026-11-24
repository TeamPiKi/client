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
  /** 프로필 */
  PROFILE: {
    /** 프로필 (내 것 · 다른 사람) */
    DETAIL: (userId: string) => ['profile', userId] as const,
  },
  /** 친구 */
  FRIEND: {
    /** 내 친구 목록 */
    LIST: ['friends'] as const,
    /** 차단 목록 */
    BLOCKED: ['blocks'] as const,
  },
  /** 탐색 */
  EXPLORE: {
    /** 토너먼트 1위 위시 목록 */
    WINNERS: ['explore', 'winners'] as const,
    FRIEND_WISHES: (friendId: string | null) => ['explore', 'friend-wishes', friendId] as const,
    FRIENDS: ['explore', 'friends'] as const,
    /** 방금 담긴 위시 목록 */
    RECENT: ['explore', 'recent'] as const,
    /** 1위 위시가 나온 토너먼트의 후보 목록 */
    CANDIDATES: (tournamentId: number) => ['explore', 'candidates', tournamentId] as const,
    /** 다른 사람 공개 폴더 상세 */
    FOLDER: (userId: string, folderId: number) => ['explore', 'folder', userId, folderId] as const,
    /** 탐색 위시 상세 */
    WISH: (wishId: number) => ['explore', 'wish', wishId] as const,
  },
};
