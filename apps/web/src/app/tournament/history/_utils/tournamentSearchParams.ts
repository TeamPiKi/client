import { PLAY_TYPE_FILTER } from '../_consts/tournamentPlayType';
import type { TournamentPlayTypeFilterT } from '../_types/tournamentPlayType';
import type { TournamentStatusTabT } from '../_types/tournamentTab';

export const parseTabParam = (tab?: string | null): TournamentStatusTabT =>
  tab === 'completed' ? 'completed' : 'ongoing';

export const parsePlayParam = (play?: string | null): TournamentPlayTypeFilterT =>
  play === PLAY_TYPE_FILTER.SOLO || play === PLAY_TYPE_FILTER.SOCIAL ? play : PLAY_TYPE_FILTER.ALL;
