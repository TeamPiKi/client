import type { GuestUserT, MemberUserT } from '@/types/user';

import { MOCK_IMAGE_URLS } from './images';

export const MOCK_GUEST_ME: GuestUserT = {
  id: 'e2e-guest-id',
  nickname: '피키게스트',
  /** 가짜 URL — fixture 가 가로채 로컬 이미지로 응답한다 (e2e/mocks/images.ts) */
  profileImage: MOCK_IMAGE_URLS.avatar,
  identityType: 'GUEST',
  email: null,
};

/** 회원 전용 UI(위시에서 가져오기 등)를 테스트할 때 사용 */
export const MOCK_MEMBER_ME: MemberUserT = {
  id: 'e2e-member-id',
  nickname: '피키회원',
  profileImage: MOCK_IMAGE_URLS.avatar,
  identityType: 'MEMBER',
  email: 'e2e@piki.dev',
};
