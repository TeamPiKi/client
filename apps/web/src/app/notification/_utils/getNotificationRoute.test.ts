import { describe, expect, it } from 'vitest';

import { getNotificationRoute } from './getNotificationRoute';

describe('getNotificationRoute', () => {
  it('토너먼트에서 담은 아이템은 refId 가 아니라 tournamentId 로 이동한다', () => {
    expect(
      getNotificationRoute('ITEM_PARSING_COMPLETED', 99, { kind: 'TOURNAMENT', tournamentId: 7 })
    ).toBe('/tournament/7/create');
  });

  it('위시에서 담은 아이템은 위시리스트로 보낸다', () => {
    expect(getNotificationRoute('ITEM_PARSING_FAILED', 99, { kind: 'WISH' })).toBe('/archive/wish');
  });
});
