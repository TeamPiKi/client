import { TOURNAMENT_PLAY_TYPE } from '@/consts/tournament';
import type { TournamentPlayTypeT } from '@/types/tournament';

export const PLAY_TYPE_FILTER = {
  ALL: 'all',
  SOLO: 'solo',
  SOCIAL: 'social',
} as const;

export type TournamentPlayTypeFilterT = (typeof PLAY_TYPE_FILTER)[keyof typeof PLAY_TYPE_FILTER];

/** NOTE: '전체'는 의도적으로 비워둔다 — 조회 시 playType 파라미터 자체가 빠진다. */
export const PLAY_TYPE_BY_FILTER: Partial<Record<TournamentPlayTypeFilterT, TournamentPlayTypeT>> =
  {
    [PLAY_TYPE_FILTER.SOLO]: TOURNAMENT_PLAY_TYPE.SOLO,
    [PLAY_TYPE_FILTER.SOCIAL]: TOURNAMENT_PLAY_TYPE.SOCIAL,
  };
