import type { UserT } from '@/types/user';

import type { GetTournamentResponseT } from '../../../_common/_types/tournamentResponse';

export const canEditTournamentItem = (
  tournament: GetTournamentResponseT,
  user: UserT,
  tournamentItemId: number
) => {
  if (tournament.status !== 'PENDING') return false;

  if (tournament.isOwner) return true;

  const pendingItem = tournament.pending.items.find(
    item => item.tournamentItemId === tournamentItemId
  );

  return pendingItem?.userId === user.id;
};
