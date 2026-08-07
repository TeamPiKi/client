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
