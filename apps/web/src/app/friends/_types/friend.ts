import type { FRIEND_TAB } from '../_consts/friendTab';

export type FriendTabT = (typeof FRIEND_TAB)[keyof typeof FRIEND_TAB];

export type FriendT = {
  userId: number;
  nickname: string;
  profileImage: string;
  isPublic: boolean;
  folderCount: number;
  wishCount: number;
};

export type BlockedUserT = {
  userId: number;
  nickname: string;
  profileImage: string;
};
