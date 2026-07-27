import { decodeJwtPayload, isTokenValid } from '@piki/core';

import type { UserIdentityTypeT } from '@/types/user';

/** access token 의 role(GUEST/MEMBER) 추출 — 만료·손상 토큰은 null */
export const getRoleFromToken = (token?: string): UserIdentityTypeT | null => {
  if (!token || !isTokenValid(token)) return null;

  const role = decodeJwtPayload(token)?.role;
  return role === 'GUEST' || role === 'MEMBER' ? role : null;
};
