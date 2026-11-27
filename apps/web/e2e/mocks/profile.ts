import type { ProfileT } from '@/app/profile/[userId]/_types/profile';

import { MOCK_IMAGE_URLS } from './images';

/** SSR 목은 경로당 고정 응답이라 첫 관계마다 사용자를 분리한다 */
export const MOCK_PROFILE_NOT_FRIEND: ProfileT = {
  userId: '11111111-1111-4111-8111-111111111111',
  nickname: '난폭한 북극곰',
  profileImage: MOCK_IMAGE_URLS.avatar,
  relation: 'NOT_FRIEND',
  foldersHidden: false,
  folders: [],
};

export const MOCK_PROFILE_FRIEND: ProfileT = {
  ...MOCK_PROFILE_NOT_FRIEND,
  userId: '22222222-2222-4222-8222-222222222222',
  nickname: '다정한 펭귄',
  relation: 'FRIEND',
};
