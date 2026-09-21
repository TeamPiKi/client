import { describe, expect, it } from 'vitest';

import isSafeInternalPath from './isSafeInternalPath';

describe('isSafeInternalPath', () => {
  it('슬래시로 시작하는 내부 경로는 통과한다', () => {
    expect(isSafeInternalPath('/')).toBe(true);
    expect(isSafeInternalPath('/archive/wish?tab=1')).toBe(true);
  });

  it('프로토콜 상대 URL 은 외부로 나가므로 차단한다', () => {
    expect(isSafeInternalPath('//evil.com')).toBe(false);
  });

  it('브라우저가 슬래시로 읽는 백슬래시도 차단한다', () => {
    expect(isSafeInternalPath('/\\evil.com')).toBe(false);
  });

  it('절대 URL 과 도메인만 있는 값은 차단한다', () => {
    expect(isSafeInternalPath('https://evil.com')).toBe(false);
    expect(isSafeInternalPath('evil.com')).toBe(false);
  });

  it('문자열이 아니거나 비어 있으면 차단한다', () => {
    const { to: missingParam } = {} as { to?: string };

    expect(isSafeInternalPath('')).toBe(false);
    expect(isSafeInternalPath(null)).toBe(false);
    expect(isSafeInternalPath(missingParam)).toBe(false);
    expect(isSafeInternalPath(123)).toBe(false);
    expect(isSafeInternalPath({})).toBe(false);
  });
});
