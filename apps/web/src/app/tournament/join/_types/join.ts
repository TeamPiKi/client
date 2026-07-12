/** 초대 코드 / 토너먼트 미리보기 응답 */
export type GetInvitePreviewResponseT = {
  tournamentId: number;
  tournamentName: string;
  itemCount: number;
  participantCount: number;
};

export type PostJoinRequestT = {
  /** 영문 대문자 3 + 숫자 3 (서버 패턴: [A-Z]{3}\d{3}). 링크 직접 진입 시 생략 가능 */
  inviteCode?: string;
};
