import type { PLAY_TYPE_FILTER } from '../_consts/tournamentPlayType';

export type TournamentPlayTypeFilterT = (typeof PLAY_TYPE_FILTER)[keyof typeof PLAY_TYPE_FILTER];
