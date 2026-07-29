import type { UserT } from '@/types/user';

export type GetAuthUrlResponseT = {
  url: string;
};

export type PostGuestLoginResponseT = {
  /** 웹 - null, 웹뷰 - string */
  accessToken: string | null;
  /** 웹 - null, 웹뷰 - string */
  refreshToken: string | null;
  user: UserT;
};

