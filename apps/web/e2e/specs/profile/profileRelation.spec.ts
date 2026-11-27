import { ERROR_CODE } from '@piki/core';

import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_PROFILE_FRIEND, MOCK_PROFILE_NOT_FRIEND } from '@e2e/mocks/profile';

/** 첫 화면은 SSR 목, 동작 후 재조회는 api.get 에 등록한 응답 */
const { userId: USER_ID, nickname: NICKNAME } = MOCK_PROFILE_NOT_FRIEND;
const { userId: FRIEND_ID, nickname: FRIEND_NICKNAME } = MOCK_PROFILE_FRIEND;

test('프로필에서 차단하면 차단 요청을 보내고 차단 상태 화면으로 바뀐다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.BLOCK(USER_ID), null);
  api.get(ENDPOINTS.PROFILE(USER_ID), {
    ...MOCK_PROFILE_NOT_FRIEND,
    relation: 'BLOCKED',
    foldersHidden: true,
  });

  await page.goto(`/profile/${USER_ID}`);
  await page.getByRole('button', { name: `${NICKNAME} 메뉴` }).click();
  await page.getByRole('menuitem', { name: '차단하기' }).click();

  const blockRequest = page.waitForRequest(
    request => request.method() === 'POST' && request.url().endsWith(ENDPOINTS.BLOCK(USER_ID))
  );
  await page.getByRole('dialog').getByRole('button', { name: '차단하기' }).click();
  await blockRequest;

  await expect(page.getByText('사용자를 차단했어요.')).toBeVisible();
  await expect(page.getByRole('button', { name: '차단 해제' })).toBeVisible();
});

test('차단 해제하면 해제 요청을 보내고 친구 추가 버튼이 보인다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.BLOCK(USER_ID), null);
  api.delete(ENDPOINTS.BLOCK(USER_ID), null);
  api.get(ENDPOINTS.PROFILE(USER_ID), {
    ...MOCK_PROFILE_NOT_FRIEND,
    relation: 'BLOCKED',
    foldersHidden: true,
  });

  await page.goto(`/profile/${USER_ID}`);
  await page.getByRole('button', { name: `${NICKNAME} 메뉴` }).click();
  await page.getByRole('menuitem', { name: '차단하기' }).click();
  await page.getByRole('dialog').getByRole('button', { name: '차단하기' }).click();
  await expect(page.getByRole('button', { name: '차단 해제' })).toBeVisible();

  api.get(ENDPOINTS.PROFILE(USER_ID), MOCK_PROFILE_NOT_FRIEND);
  const unblockRequest = page.waitForRequest(
    request => request.method() === 'DELETE' && request.url().endsWith(ENDPOINTS.BLOCK(USER_ID))
  );
  await page.getByRole('button', { name: '차단 해제' }).click();
  await unblockRequest;

  await expect(page.getByText('차단을 해제했어요.')).toBeVisible();
  await expect(page.getByRole('button', { name: '친구 추가' })).toBeVisible();
});

test('친구를 삭제하면 삭제 요청을 보내고 친구 추가 버튼으로 바뀐다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.delete(ENDPOINTS.FRIEND(FRIEND_ID), null);
  api.get(ENDPOINTS.PROFILE(FRIEND_ID), { ...MOCK_PROFILE_FRIEND, relation: 'NOT_FRIEND' });

  await page.goto(`/profile/${FRIEND_ID}`);
  await page.getByRole('button', { name: `${FRIEND_NICKNAME} 메뉴` }).click();
  await page.getByRole('menuitem', { name: '친구 삭제하기' }).click();

  const deleteRequest = page.waitForRequest(
    request => request.method() === 'DELETE' && request.url().endsWith(ENDPOINTS.FRIEND(FRIEND_ID))
  );
  await page.getByRole('dialog').getByRole('button', { name: '삭제하기' }).click();
  await deleteRequest;

  await expect(page.getByText('친구를 삭제했어요.')).toBeVisible();
  await expect(page.getByRole('button', { name: '친구 추가' })).toBeVisible();
});

test('차단할 상대가 없으면 안내 토스트를 띄우고 화면은 그대로다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.error('POST', ENDPOINTS.BLOCK(USER_ID), { status: 404, code: ERROR_CODE.USER_NOT_FOUND });

  await page.goto(`/profile/${USER_ID}`);
  await page.getByRole('button', { name: `${NICKNAME} 메뉴` }).click();
  await page.getByRole('menuitem', { name: '차단하기' }).click();
  await page.getByRole('dialog').getByRole('button', { name: '차단하기' }).click();

  await expect(page.getByText('존재하지 않는 계정이에요.')).toBeVisible();
  await expect(page.getByRole('button', { name: '차단 해제' })).toHaveCount(0);
});
