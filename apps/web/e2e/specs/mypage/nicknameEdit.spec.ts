import type { Page } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import type { ApiMockT } from '@e2e/fixtures/mockApiFixture';
import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';

const gotoProfileEdit = async (page: Page, api: ApiMockT) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);

  await page.goto('/mypage/edit');
  await expect(page.getByRole('heading', { name: '프로필 수정' })).toBeVisible();
};

test('닉네임을 수정하면 마이페이지에 반영된다', async ({ page, api }) => {
  const NEW_NICKNAME = '피키새닉';
  await gotoProfileEdit(page, api);

  const submitButton = page.getByRole('button', { name: '수정하기' });
  await expect(submitButton).toBeDisabled();

  await page.getByRole('textbox').fill(NEW_NICKNAME);
  await expect(submitButton).toBeEnabled();

  const updatedMe = { ...MOCK_MEMBER_ME, nickname: NEW_NICKNAME };
  api.patch(ENDPOINTS.USER, updatedMe);
  api.get(ENDPOINTS.USER, updatedMe);

  const patchRequest = page.waitForRequest(
    request => request.method() === 'PATCH' && request.url().includes(ENDPOINTS.USER)
  );
  await submitButton.click();

  expect((await patchRequest).postDataJSON()).toEqual({ nickname: NEW_NICKNAME });
  await expect(page).toHaveURL(/\/mypage$/);
  await expect(page.getByText(NEW_NICKNAME)).toBeVisible();
});
