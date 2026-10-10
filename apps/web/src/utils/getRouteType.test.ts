import { describe, expect, it } from 'vitest';

import { getRouteType } from './getRouteType';

describe('getRouteType', () => {
  it('하위 경로는 슬래시로 이어질 때만 같은 권한을 받는다', () => {
    expect(getRouteType('/home')).toBe('MEMBER_AND_GUEST');
    expect(getRouteType('/home/anything')).toBe('MEMBER_AND_GUEST');
    expect(getRouteType('/homework')).toBeNull();

    expect(getRouteType('/archive/wish')).toBe('MEMBER_ONLY');
    expect(getRouteType('/archive/wish/3')).toBe('MEMBER_ONLY');
    expect(getRouteType('/archive/wishlist')).toBeNull();
  });

  it('토너먼트 동적 경로는 id 세그먼트 하나와 정확한 끝만 허용한다', () => {
    expect(getRouteType('/tournament/1/match')).toBe('AUTHORIZED');
    expect(getRouteType('/tournament/1/match/extra')).toBeNull();
    expect(getRouteType('/tournament/1/2/match')).toBeNull();

    expect(getRouteType('/tournament/1/item/5')).toBe('AUTHORIZED');
    expect(getRouteType('/tournament/1/item')).toBeNull();
  });

  it('참여 링크 하위 경로는 토너먼트 동적 패턴과 겹쳐도 검사 순서로 MEMBER_AND_GUEST 가 이긴다', () => {
    expect(getRouteType('/tournament/join/match')).toBe('MEMBER_AND_GUEST');
    expect(getRouteType('/tournament/join/create')).toBe('MEMBER_AND_GUEST');
    expect(getRouteType('/tournament/join/result')).toBe('MEMBER_AND_GUEST');
  });

  it('선택 하위 세그먼트는 정해진 것만 붙는다', () => {
    expect(getRouteType('/tournament/1/create')).toBe('AUTHORIZED');
    expect(getRouteType('/tournament/1/create/by-wish')).toBe('AUTHORIZED');
    expect(getRouteType('/tournament/1/create/other')).toBeNull();

    expect(getRouteType('/tournament/1/result')).toBe('AUTHORIZED');
    expect(getRouteType('/tournament/1/result/group')).toBe('AUTHORIZED');
  });

  it('소셜 로그인 콜백은 provider 세그먼트가 딱 하나일 때만 공개다', () => {
    expect(getRouteType('/auth/callback/kakao')).toBe('PUBLIC');
    expect(getRouteType('/auth/callback')).toBeNull();
    expect(getRouteType('/auth/callback/kakao/extra')).toBeNull();
  });

  it('정확히 일치하는 경로의 권한은 하위 경로로 번지지 않는다', () => {
    expect(getRouteType('/mypage')).toBe('MEMBER_AND_GUEST');
    expect(getRouteType('/mypage/edit')).toBe('MEMBER_ONLY');
    expect(getRouteType('/mypage/unknown')).toBeNull();
  });
});
