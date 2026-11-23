import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import {
  MOCK_BLOCKED_USER,
  MOCK_BLOCKED_USERS,
  MOCK_FRIENDS,
  MOCK_FRIEND_PIKI,
  createBlocksResponse,
  createFriendsResponse,
} from '@e2e/mocks/friend';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';

const FRIEND = MOCK_FRIEND_PIKI;
const BLOCKED_USER_ID = MOCK_BLOCKED_USER.userId;

test('친구 목록에서 차단하면 차단 요청을 보내고 친구에서 빠져 차단 목록에 들어간다', async ({
  page,
  api,
}) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.FRIENDS, createFriendsResponse(MOCK_FRIENDS));
  api.get(ENDPOINTS.BLOCKS, createBlocksResponse(MOCK_BLOCKED_USERS));
  api.post(ENDPOINTS.BLOCK(FRIEND.userId), null);

  await page.goto('/friends');
  await page.getByRole('button', { name: `${FRIEND.nickname} 메뉴` }).click();
  await page.getByRole('menuitem', { name: '차단하기' }).click();

  api.get(
    ENDPOINTS.FRIENDS,
    createFriendsResponse(MOCK_FRIENDS.filter(friend => friend.userId !== FRIEND.userId))
  );
  api.get(ENDPOINTS.BLOCKS, createBlocksResponse([...MOCK_BLOCKED_USERS, FRIEND]));
  const blockRequest = page.waitForRequest(
    request => request.method() === 'POST' && request.url().endsWith(ENDPOINTS.BLOCK(FRIEND.userId))
  );
  await page.getByRole('dialog').getByRole('button', { name: '차단하기' }).click();
  await blockRequest;

  await expect(page.getByText('사용자를 차단했어요.')).toBeVisible();
  await expect(page.getByRole('button', { name: `${FRIEND.nickname} 메뉴` })).toHaveCount(0);

  await page.getByRole('tab', { name: '차단 목록' }).click();
  await expect(page.getByRole('button', { name: `${FRIEND.nickname} 메뉴` })).toBeVisible();
});

test('차단 목록에서 차단 해제하면 해제 요청을 보내고 목록에서 빠진다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.FRIENDS, createFriendsResponse(MOCK_FRIENDS));
  api.get(ENDPOINTS.BLOCKS, createBlocksResponse(MOCK_BLOCKED_USERS));
  api.delete(ENDPOINTS.BLOCK(BLOCKED_USER_ID), null);

  await page.goto('/friends?tab=blocked');
  const menus = page.getByRole('button', { name: '닉네임 메뉴' });
  await expect(menus).toHaveCount(2);
  await menus.first().click();

  api.get(
    ENDPOINTS.BLOCKS,
    createBlocksResponse(MOCK_BLOCKED_USERS.filter(user => user.userId !== BLOCKED_USER_ID))
  );

  const unblockRequest = page.waitForRequest(
    request =>
      request.method() === 'DELETE' && request.url().endsWith(ENDPOINTS.BLOCK(BLOCKED_USER_ID))
  );
  await page.getByRole('menuitem', { name: '차단해제' }).click();
  await unblockRequest;

  await expect(page.getByText('차단을 해제했어요.')).toBeVisible();
  await expect(menus).toHaveCount(1);
});
