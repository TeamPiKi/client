/** 실서버는 Set-Cookie 와 body 에 같은 토큰을 주지만, 스텁은 proxy 가 어느 쪽을 저장했는지 구분하려 sub 를 달리 준다 */
export const REFRESHED_COOKIE_TOKEN_SUB = 'e2e-refreshed-cookie';
export const REFRESHED_BODY_TOKEN_SUB = 'e2e-refreshed-body';
export const ISSUED_GUEST_TOKEN_SUB = 'e2e-issued-guest';
