/** 토큰 갱신/발급 응답 body — APP=값, WEB=null(쿠키로 전달) */
export type AuthTokensT = {
  accessToken: string | null;
  refreshToken: string | null;
};
