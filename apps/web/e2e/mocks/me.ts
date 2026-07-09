import type { GuestUserT } from '@/types/user';

export const MOCK_GUEST_ME: GuestUserT = {
  id: 'e2e-guest-id',
  nickname: '피키게스트',
  /** 외부 이미지 URL 금지 — next/image 가 서버사이드에서 fetch 해 목킹이 불가능하다 */
  profileImage: '',
  identityType: 'GUEST',
  email: null,
};
