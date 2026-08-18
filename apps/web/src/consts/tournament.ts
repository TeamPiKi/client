/** 시작에 필요한 최소 후보 수 — 서버도 2~32개를 요구한다 (TOURNAMENT-007) */
export const MIN_TOURNAMENT_ITEM_COUNT = 2;

export const TOURNAMENT_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

/** 플레이 방식 — 혼자(SOLO) / 여럿이 함께(SOCIAL) */
export const TOURNAMENT_PLAY_TYPE = {
  SOLO: 'SOLO',
  SOCIAL: 'SOCIAL',
} as const;
