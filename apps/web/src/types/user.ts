/** 유저 식별 타입: GUEST(비회원), MEMBER(회원) */
export type UserIdentityTypeT = 'GUEST' | 'MEMBER';

/** 유저 정보 */
export type UserT = GuestUserT | MemberUserT;

export type GuestUserT = BaseUserT & {
  /** 유저 식별 타입 */
  identityType: 'GUEST';
  /** 유저 이메일 */
  email: null;
};

export type MemberUserT = BaseUserT & {
  /** 유저 식별 타입 */
  identityType: 'MEMBER';
  /** 유저 이메일 */
  email: string;
};

type BaseUserT = {
  /** 유저 ID */
  id: string;
  /** 유저 닉네임 */
  nickname: string;
  /** 유저 프로필 이미지 URL */
  profileImage: string;
};

/** 닉네임 중복 체크 응답 */
export type GetNicknameCheckResponseT = {
  available: boolean;
};
