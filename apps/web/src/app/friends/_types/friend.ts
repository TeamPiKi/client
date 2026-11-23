import type { FRIEND_TAB } from '../_consts/friendTab';

export type FriendTabT = (typeof FRIEND_TAB)[keyof typeof FRIEND_TAB];

export type FriendT = {
  userId: string;
  nickname: string;
  profileImage: string;
  /** 상대가 프로필을 비공개로 두면 없음 */
  folderCount?: number | null;
  wishCount?: number | null;
};

export type GetFriendsResponseT = {
  friendCount: number;
  friends: FriendT[];
};

export type BlockedUserT = {
  userId: string;
  nickname: string;
  profileImage: string;
};
