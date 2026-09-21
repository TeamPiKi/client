import { describe, expect, it } from 'vitest';

import { QUERY_ACTION } from '@/consts/queryAction';

import { getLoginPath, getLoginRedirectPath } from './loginRedirect';

describe('getLoginPath', () => {
  it('내부 경로는 redirect 로 실어 보낸다', () => {
    expect(getLoginPath('/archive/wish')).toBe('/login?redirect=%2Farchive%2Fwish');
  });

  it('외부로 나가는 경로는 redirect 에서 뺀다', () => {
    expect(getLoginPath('//evil.com')).toBe('/login');
    expect(getLoginPath('/\\evil.com')).toBe('/login');
  });

  it('action 과 code 는 있을 때만 붙는다', () => {
    expect(getLoginPath(null)).toBe('/login');
    expect(getLoginPath(null, QUERY_ACTION.VALUE.SESSION_EXPIRED)).toBe(
      '/login?action=session-expired'
    );
    expect(getLoginPath('/home', QUERY_ACTION.VALUE.MEMBER_ONLY, 'USER-003')).toBe(
      '/login?redirect=%2Fhome&action=member-only&code=USER-003'
    );
  });
});

describe('getLoginRedirectPath', () => {
  it('외부로 나가는 경로가 오면 홈으로 폴백한다', () => {
    expect(getLoginRedirectPath('/\\evil.com')).toBe('/home');
  });
});
