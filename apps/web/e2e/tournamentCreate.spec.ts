import { ENDPOINTS } from '@/consts/api';

import { expect, test } from './fixtures/mockApiFixture';
import { MOCK_GUEST_ME } from './mocks/me';
import { MOCK_TOURNAMENT_PENDING } from './mocks/tournament';

test('토너먼트 준비 페이지에 진입하면 토너먼트 이름이 렌더링된다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  /** AUTHORIZED 라우트 — 가짜 게스트 JWT(storageState)로 미들웨어 통과를 함께 검증한다 */
  await page.goto('/tournament/1/create');

  await expect(page.getByText('E2E 토너먼트')).toBeVisible();
});
