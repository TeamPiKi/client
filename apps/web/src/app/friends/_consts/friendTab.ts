import { ROUTES } from '@/consts/route';

import type { FriendTabT } from '../_types/friend';

export const FRIEND_TAB = {
  FRIENDS: 'friends',
  BLOCKED: 'blocked',
} as const;

export const FRIEND_TAB_PATH: Record<FriendTabT, string> = {
  [FRIEND_TAB.FRIENDS]: ROUTES.FRIENDS,
  [FRIEND_TAB.BLOCKED]: ROUTES.FRIENDS_BLOCKED_TAB,
};

export const FRIEND_TAB_PANEL_ID = 'friend-tab-panel';
