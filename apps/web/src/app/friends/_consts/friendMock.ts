import type { BlockedUserT } from '../_types/friend';

/** TEMP: 차단 목록 API 연동 전 목데이터 */
export const BLOCKED_USERS_MOCK: BlockedUserT[] = [
  {
    userId: '00000000-0000-4000-8000-000000000004',
    nickname: '닉네임',
    profileImage: 'https://picsum.photos/seed/piki-blocked-1/60',
  },
  {
    userId: '00000000-0000-4000-8000-000000000005',
    nickname: '닉네임',
    profileImage: 'https://picsum.photos/seed/piki-blocked-2/60',
  },
];
