export type PostJoinRequestT = {
  /** 영문 대문자 3 + 숫자 3 (서버 패턴: [A-Z]{3}\d{3}). 링크 직접 진입 시 생략 가능 */
  inviteCode?: string;
};

export type PostJoinGuestRequestT = {
  inviteCode: string;
  /** 토너먼트 표시명 겸 게스트 닉네임 (1~10자) */
  nickname: string;
};

export type PostJoinGuestResponseT = {
  userId: string;
  nickname: string;
  profileImage: string;
  tournamentId: number;
  /** 웹 - null, 웹뷰 - string */
  accessToken: string | null;
  /** 웹 - null, 웹뷰 - string */
  refreshToken: string | null;
};

export type PatchTournamentNicknameRequestT = {
  /** 이 토너먼트에서만 쓰이는 표시명 (1~10자). 전역 프로필 닉네임과 별개 */
  nickname: string;
};
