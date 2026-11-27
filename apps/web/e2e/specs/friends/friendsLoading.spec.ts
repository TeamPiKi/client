import { ENDPOINTS } from '@/consts/api';
import { ROUTES } from '@/consts/route';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { setSsrDelay } from '@e2e/helpers/ssrDelay';
import {
  MOCK_BLOCKED_USERS,
  MOCK_FRIENDS,
  createBlocksResponse,
  createFriendsResponse,
} from '@e2e/mocks/friend';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';

/** 로딩 화면이 보이는 동안 검사할 수 있게 친구 목록 SSR 응답을 늦춤 */
const SSR_DELAY_MS = 3000;

test('차단 목록 탭으로 들어오면 로딩 중에도 두 탭과 차단 목록 선택을 그대로 보여준다', async ({
  page,
  api,
}) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.FRIENDS, createFriendsResponse(MOCK_FRIENDS));
  api.get(ENDPOINTS.BLOCKS, createBlocksResponse(MOCK_BLOCKED_USERS));
  await setSsrDelay(page, `GET ${ENDPOINTS.FRIENDS}`, SSR_DELAY_MS);

  await page.goto(ROUTES.FRIENDS_BLOCKED_TAB, { waitUntil: 'commit' });

  await expect(page.locator('main[aria-busy]')).toBeVisible();
  await expect(page.getByRole('tab', { name: '친구', exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: '차단 목록' })).toHaveAttribute(
    'aria-selected',
    'true'
  );

  await expect(page.locator('main[aria-busy]')).toHaveCount(0, { timeout: SSR_DELAY_MS + 5000 });
  await expect(page.getByRole('tab', { name: `친구 ${MOCK_FRIENDS.length}` })).toBeVisible();
  await expect(page.getByRole('tab', { name: '차단 목록' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
});
