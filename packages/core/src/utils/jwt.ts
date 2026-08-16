type JwtPayloadT = {
  iat?: number;
  exp?: number;
  role?: string;
};

/** JWT payload 디코드 — 실패 시 null */
export const decodeJwtPayload = (token: string): JwtPayloadT | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JwtPayloadT;
  } catch {
    return null;
  }
};

/**
 * 토큰 미만료 여부 반환 — payload 의 exp 만 본다.
 *
 * 서명은 검증하지 않는다(프론트에 시크릿이 없다). 서버가 거부하는 토큰이라도 exp 가 남아 있으면 true 이므로,
 * "서버가 받아준다"는 보장으로 쓰면 안 된다. 진짜 판정은 백엔드의 401 이다.
 *
 * @param leewayMs - 여유시간. 설정 시 현재 시간 + 여유시간 < exp 이면 미만료로 판단.
 */
export const isTokenUnexpired = (token: string | null, leewayMs = 0): boolean => {
  if (!token) return false;

  const exp = decodeJwtPayload(token)?.exp;
  return typeof exp === 'number' && Date.now() + leewayMs < exp * 1000;
};

/**
 * 토큰 발급 시각 반환
 * — iat 없거나 디코드 실패 시 null
 */
const getTokenIssuedAt = (token: string | null): number | null => {
  if (!token) return null;

  const iat = decodeJwtPayload(token)?.iat;
  return typeof iat === 'number' ? iat * 1000 : null;
};

/**
 * candidate 가 base 보다 최신 토큰인지 iat 비교로 판단
 *
 * - candidate가 최신인 경우 true 반환
 * - base가 최신인 경우 false 반환
 * - iat 판단 불가 시 false 반환
 */
export const isFresherToken = (candidate: string | null, base: string | null): boolean => {
  const candidateIssuedAt = getTokenIssuedAt(candidate);
  if (candidateIssuedAt === null) return false;

  const baseIssuedAt = getTokenIssuedAt(base);
  if (baseIssuedAt === null) return true;

  return candidateIssuedAt > baseIssuedAt;
};

/**
 * 토큰 exp 를 쿠키 expires(ISO)로 반환
 *
 * - 디코드 실패 시 null 반환
 */
export const getTokenExpiresIso = (token: string): string | null => {
  const exp = decodeJwtPayload(token)?.exp;
  return typeof exp === 'number' ? new Date(exp * 1000).toISOString() : null;
};

/**
 * 토큰 만료시간(exp)까지 남은 시간(초) 반환
 *
 * - 손상된 토큰은 null 반환
 */
export const getTokenMaxAge = (token: string): number | null => {
  const exp = decodeJwtPayload(token)?.exp;
  if (typeof exp !== 'number') return null;

  return Math.max(0, Math.floor(exp - Date.now() / 1000));
};
