import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_GUEST_ME } from '@e2e/mocks/me';
import { MOCK_TOURNAMENT_LIST, MOCK_TOURNAMENT_PENDING } from '@e2e/mocks/tournament';

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

test('플레이 유형을 고르면 playType 을 담아 조회한다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, []);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  await page.goto('/archive/tournament');

  const listRequest = page.waitForRequest(request => {
    const url = new URL(request.url());

    return url.pathname === ENDPOINTS.TOURNAMENTS && url.searchParams.has('playType');
  });

  await page.getByRole('button', { name: '소셜플레이' }).click();

  const url = new URL((await listRequest).url());

  expect(url.searchParams.get('playType')).toBe('SOCIAL');
});

test('토너먼트를 열었다 뒤로 돌아오면 떠날 때의 탭이 그대로 활성이다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  /** 완료 탭 주소로 진입 후 진행 중으로 전환 — 주소만 바뀌고 RSC 는 완료 탭인 상태 */
  await page.goto('/archive/tournament?tab=completed&play=all');
  await page.getByRole('button', { name: '진행 중' }).click();

  await page.getByRole('link', { name: 'E2E 토너먼트' }).click();
  await page.waitForURL(/\/tournament\/1\/create/);

  await page.goBack();
  await expect(page).toHaveURL(/tab=ongoing/);

  const ongoingTab = page.getByRole('button', { name: '진행 중' });
  const completedTab = page.getByRole('button', { name: '완료' });

  /** 활성 탭은 밑줄(span)을 가진다 — 주소와 어긋나면 완료 탭이 활성으로 복원된다 */
  await expect(ongoingTab.locator('span')).toBeVisible();
  await expect(completedTab.locator('span')).toHaveCount(0);
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
