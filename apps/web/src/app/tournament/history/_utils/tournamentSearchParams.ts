import { PLAY_TYPE_FILTER, type TournamentPlayTypeFilterT } from '../_consts/tournamentPlayType';
import type { TournamentStatusTabT } from '../_consts/tournamentTab';

export const parseTabParam = (tab?: string | null): TournamentStatusTabT =>
  tab === 'completed' ? 'completed' : 'ongoing';

export const parsePlayParam = (play?: string | null): TournamentPlayTypeFilterT =>
  play === PLAY_TYPE_FILTER.SOLO || play === PLAY_TYPE_FILTER.SOCIAL ? play : PLAY_TYPE_FILTER.ALL;
