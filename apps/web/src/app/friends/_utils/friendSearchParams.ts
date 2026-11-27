import { FRIEND_TAB } from '../_consts/friendTab';
import type { FriendTabT } from '../_types/friend';

export const parseFriendTabParam = (tab?: string | null): FriendTabT =>
  tab === FRIEND_TAB.BLOCKED ? FRIEND_TAB.BLOCKED : FRIEND_TAB.FRIENDS;
