import { randomUUID } from 'node:crypto';

const toBase64Url = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');

export type FakeJwtPayloadT = {
  sub: string;
  role: 'GUEST' | 'MEMBER';
  exp: number;
  jti: string;
};

/**
 * 미들웨어(src/proxy.ts)의 isTokenUnexpired는 서명 검증 없이 payload.exp만 확인한다.
 * exp가 미래인 JWT 형태 문자열이면 미들웨어를 통과하고,
 * 서버사이드 게스트 로그인(postGuestLoginServer)이 발생하지 않는다 — 네트워크 0회.
 */
export const createFakeJwt = (
  expiresInSeconds = 60 * 60,
  role: 'GUEST' | 'MEMBER' = 'MEMBER',
  sub = 'e2e-user'
) =>
  [
    toBase64Url({ alg: 'HS256', typ: 'JWT' }),
    toBase64Url({
      sub,
      /** role 클레임 기반 gating(getRoleFromToken)용 — 기본 MEMBER 는 SSR 목의 MOCK_MEMBER_ME(회원 고정)와 정합 */
      role,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
      /** 같은 초에 만든 토큰이 같아지면 proxy 가 refresh 요청을 dedupe 해 병렬 테스트끼리 결과를 공유한다 */
      jti: randomUUID(),
    }),
    'e2e-fake-signature',
  ].join('.');

export const readFakeJwtPayload = (token: string | undefined): FakeJwtPayloadT | null => {
  if (!token) return null;
  try {
    return JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString());
  } catch {
    return null;
  }
};
