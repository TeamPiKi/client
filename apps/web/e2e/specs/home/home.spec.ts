import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_GUEST_ME } from '@e2e/mocks/me';
import { MOCK_TOURNAMENT_LIST } from '@e2e/mocks/tournament';

test('홈에 진입하면 최근 생성한 토너먼트 목록이 렌더링된다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  await page.goto('/home');

  await expect(page.getByRole('heading', { name: '최근 토너먼트' })).toBeVisible();
  await expect(page.getByText('E2E 토너먼트')).toBeVisible();
});

test('최근 생성한 토너먼트가 없으면 empty state가 렌더링된다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, []);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  await page.goto('/home');

  await expect(page.getByRole('status')).toBeVisible();
});
