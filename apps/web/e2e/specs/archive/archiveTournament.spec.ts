import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_GUEST_ME } from '@e2e/mocks/me';

test('플레이 유형 칩을 누르면 선택 상태와 주소가 함께 바뀐다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, []);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  await page.goto('/archive/tournament');

  const allChip = page.getByRole('button', { name: '전체' });
  const soloChip = page.getByRole('button', { name: '솔로플레이' });

  await expect(allChip).toHaveAttribute('aria-pressed', 'true');

  await soloChip.click();

  await expect(soloChip).toHaveAttribute('aria-pressed', 'true');
  await expect(allChip).toHaveAttribute('aria-pressed', 'false');
  await expect(page).toHaveURL(/play=solo/);
});

test('탭을 옮기면 플레이 유형 필터가 전체로 초기화된다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, []);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  await page.goto('/archive/tournament?tab=ongoing&play=solo');

  const allChip = page.getByRole('button', { name: '전체' });
  const soloChip = page.getByRole('button', { name: '솔로플레이' });

  await expect(soloChip).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: '완료' }).click();

  await expect(allChip).toHaveAttribute('aria-pressed', 'true');
  await expect(soloChip).toHaveAttribute('aria-pressed', 'false');
  await expect(page).toHaveURL(/play=all/);
});
