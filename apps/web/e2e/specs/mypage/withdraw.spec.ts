import { ERROR_CODE, ERROR_MESSAGE_MAP } from '@piki/core';
import type { Page } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import type { ApiMockT } from '@e2e/fixtures/mockApiFixture';
import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';

const openWithdrawDialog = async (page: Page, api: ApiMockT) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);

  await page.goto('/mypage/withdraw');
  await expect(page.getByText(`${MOCK_MEMBER_ME.nickname}님, PiKi를 떠나시나요?`)).toBeVisible();

  await page.getByRole('button', { name: '탈퇴하기' }).click();
  await expect(page.getByRole('dialog', { name: '정말 탈퇴하시겠어요?' })).toBeVisible();
};

test('탈퇴를 확정하면 세션을 정리하고 로그인으로 이동한다', async ({ page, api }) => {
  await openWithdrawDialog(page, api);
  api.delete(ENDPOINTS.USER, null);

  const deleteRequest = page.waitForRequest(
    request => request.method() === 'DELETE' && request.url().includes(ENDPOINTS.USER)
  );
  await page.getByRole('button', { name: '떠날래요' }).click();
  await deleteRequest;

  /** 세션 폐기 서버 액션 뒤의 이동이라 병렬 실행 부하 시 기본 5초를 넘길 수 있어 여유를 둔다 */
  await expect(page).toHaveURL(/\/login$/, { timeout: 15_000 });
  await expect(page.getByRole('button', { name: '카카오로 시작하기' })).toBeVisible();

  const cookies = await page.context().cookies();
  expect(cookies.find(cookie => cookie.name === 'access_token')).toBeUndefined();
  expect(cookies.find(cookie => cookie.name === 'refresh_token')).toBeUndefined();
});

test('탈퇴가 거절되면 안내 토스트를 띄우고 화면에 남는다', async ({ page, api }) => {
  await openWithdrawDialog(page, api);
  api.error('DELETE', ENDPOINTS.USER, {
    status: 403,
    code: ERROR_CODE.USER_GUEST_CANNOT_WITHDRAW,
  });

  await page.getByRole('button', { name: '떠날래요' }).click();

  await expect(
    page.getByText(ERROR_MESSAGE_MAP[ERROR_CODE.USER_GUEST_CANNOT_WITHDRAW])
  ).toBeVisible();
  await expect(page.getByRole('dialog', { name: '정말 탈퇴하시겠어요?' })).toBeHidden();
  await expect(page).toHaveURL(/\/mypage\/withdraw$/);
});
