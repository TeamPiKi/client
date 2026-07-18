import type { GuestUserT } from '@/types/user';

import { MOCK_IMAGE_URLS } from './images';

export const MOCK_GUEST_ME: GuestUserT = {
  id: 'e2e-guest-id',
  nickname: '피키게스트',
  /** 가짜 URL — fixture 가 가로채 로컬 이미지로 응답한다 (e2e/mocks/images.ts) */
  profileImage: MOCK_IMAGE_URLS.avatar,
  identityType: 'GUEST',
  email: null,
};
