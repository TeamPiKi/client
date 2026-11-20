import type { BlockedUserT, FriendT } from '../_types/friend';

/** TEMP: 친구·차단 목록 API 연동 전 목데이터 */
export const FRIENDS_MOCK: FriendT[] = [
  {
    userId: 1,
    nickname: '닉네임',
    profileImage: 'https://picsum.photos/seed/piki-friend-1/60',
    isPublic: true,
    folderCount: 0,
    wishCount: 0,
  },
  {
    userId: 2,
    nickname: '피키',
    profileImage: 'https://picsum.photos/seed/piki-friend-2/60',
    isPublic: true,
    folderCount: 3,
    wishCount: 12,
  },
  {
    userId: 3,
    nickname: '지은',
    profileImage: 'https://picsum.photos/seed/piki-friend-3/60',
    isPublic: false,
    folderCount: 1,
    wishCount: 4,
  },
];

/** TEMP: 친구·차단 목록 API 연동 전 목데이터 */
export const BLOCKED_USERS_MOCK: BlockedUserT[] = [
  {
    userId: 4,
    nickname: '닉네임',
    profileImage: 'https://picsum.photos/seed/piki-blocked-1/60',
  },
  {
    userId: 5,
    nickname: '닉네임',
    profileImage: 'https://picsum.photos/seed/piki-blocked-2/60',
  },
];
