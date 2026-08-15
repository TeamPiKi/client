import { type DeepLinkPayloadT, PUSH_NOTIFICATION_TYPE } from '@piki/core';

import { ROUTES } from '@/consts/route';

export const getPushNotificationRoute = (payload: DeepLinkPayloadT) => {
  switch (payload.type) {
    case PUSH_NOTIFICATION_TYPE.TOURNAMENT_JOINED:
    case PUSH_NOTIFICATION_TYPE.TOURNAMENT_ITEM_ADDED:
      return ROUTES.TOURNAMENT_CREATE(payload.refId);
    case PUSH_NOTIFICATION_TYPE.ITEM_PARSING_COMPLETED:
    case PUSH_NOTIFICATION_TYPE.ITEM_PARSING_INCOMPLETE:
    case PUSH_NOTIFICATION_TYPE.ITEM_PARSING_FAILED:
      if (payload.kind === 'TOURNAMENT' && payload.tournamentId) {
        return ROUTES.TOURNAMENT_CREATE(payload.tournamentId);
      }
      return ROUTES.WISHLIST;
  }
};
