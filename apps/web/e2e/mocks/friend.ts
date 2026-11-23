import { MOCK_IMAGE_URLS } from './images';

type BlockedUserMockT = { userId: string; nickname: string; profileImage: string };
type FriendMockT = BlockedUserMockT & { folderCount?: number; wishCount?: number };

export const MOCK_FRIEND_PIKI: FriendMockT = {
  userId: '00000000-0000-4000-8000-000000000002',
  nickname: '피키',
  profileImage: MOCK_IMAGE_URLS.avatar,
  folderCount: 3,
  wishCount: 12,
};

export const MOCK_BLOCKED_USER: BlockedUserMockT = {
  userId: '00000000-0000-4000-8000-000000000004',
  nickname: '닉네임',
  profileImage: MOCK_IMAGE_URLS.avatar,
};

/** 화면 목데이터(friendMock)와 같은 사용자 — 조회 API 연동 전후 모두 같은 목록 */
export const MOCK_FRIENDS: FriendMockT[] = [
  {
    userId: '00000000-0000-4000-8000-000000000001',
    nickname: '닉네임',
    profileImage: MOCK_IMAGE_URLS.avatar,
    folderCount: 0,
    wishCount: 0,
  },
  MOCK_FRIEND_PIKI,
  {
    userId: '00000000-0000-4000-8000-000000000003',
    nickname: '지은',
    profileImage: MOCK_IMAGE_URLS.avatar,
  },
];

export const MOCK_BLOCKED_USERS: BlockedUserMockT[] = [
  MOCK_BLOCKED_USER,
  {
    userId: '00000000-0000-4000-8000-000000000005',
    nickname: '닉네임',
    profileImage: MOCK_IMAGE_URLS.avatar,
  },
];

export const createFriendsResponse = (friends: FriendMockT[]) => ({
  friendCount: friends.length,
  friends,
});

export const createBlocksResponse = (blocked: BlockedUserMockT[]) => ({ blocked });
