import { describe, expect, it } from 'vitest';

import { getAppVersion, isAppVersionSupported } from './appVersion';

describe('isAppVersionSupported', () => {
  it('자릿수가 커진 마이너 버전을 문자열 순서가 아니라 숫자로 비교한다', () => {
    expect(isAppVersionSupported('1.10.0', '1.9.0')).toBe(true);
    expect(isAppVersionSupported('1.9.0', '1.10.0')).toBe(false);
  });

  it('최소 버전과 같으면 지원한다', () => {
    expect(isAppVersionSupported('1.2.0', '1.2.0')).toBe(true);
  });

  it('빠진 자리는 0 으로 본다', () => {
    expect(isAppVersionSupported('1.2', '1.2.0')).toBe(true);
    expect(isAppVersionSupported('1.2.0', '1.2')).toBe(true);
    expect(isAppVersionSupported('1.2', '1.2.1')).toBe(false);
  });

  it('앱 버전을 모르면 지원하지 않는 것으로 본다', () => {
    expect(isAppVersionSupported(null, '1.0.0')).toBe(false);
  });
});

describe('getAppVersion', () => {
  const BROWSER_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148';

  it('웹뷰 UA 의 토큰에서 버전만 뽑는다', () => {
    expect(getAppVersion(`${BROWSER_UA} PIKI_APP/1.2.0`)).toBe('1.2.0');
  });

  it('토큰은 있지만 버전이 없으면 null 이다', () => {
    expect(getAppVersion(`${BROWSER_UA} PIKI_APP`)).toBeNull();
  });

  it('앱이 아닌 브라우저 UA 는 null 이다', () => {
    expect(getAppVersion(BROWSER_UA)).toBeNull();
    expect(getAppVersion(null)).toBeNull();
  });
});
