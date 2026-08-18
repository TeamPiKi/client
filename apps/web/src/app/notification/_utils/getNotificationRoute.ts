import { ROUTES } from '@/consts/route';

import type { NotificationItemT, NotificationTypeT } from '@/types/notification';

export const getNotificationRoute = (
  type: NotificationTypeT,
  refId: number,
  extra?: Pick<NotificationItemT, 'kind' | 'tournamentId'>
): string | null => {
  switch (type) {
    case 'TOURNAMENT_JOINED':
    case 'TOURNAMENT_ITEM_ADDED':
    case 'TOURNAMENT_STARTED':
    case 'TOURNAMENT_PLAYED_FROM_LINK':
      return ROUTES.TOURNAMENT_CREATE(refId);
    case 'TOURNAMENT_COMPLETED':
      return ROUTES.TOURNAMENT_GROUP_RESULT(refId);
    case 'TOURNAMENT_RESULT_READY':
      return ROUTES.TOURNAMENT_RESULT(refId);
    case 'ITEM_PARSING_COMPLETED':
    case 'ITEM_PARSING_INCOMPLETE':
    case 'ITEM_PARSING_FAILED':
      if (extra?.kind === 'TOURNAMENT' && extra.tournamentId) {
        return ROUTES.TOURNAMENT_CREATE(extra.tournamentId);
      }
      return ROUTES.WISHLIST;
    case 'ANNOUNCEMENT':
    case 'TOURNAMENT_ITEM_DELETED':
      return null;
  }
};
