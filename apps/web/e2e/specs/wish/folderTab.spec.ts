import { ERROR_CODE } from '@piki/core';

import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { setSsrEmpty } from '@e2e/helpers/ssrEmpty';
import { MOCK_FOLDER, MOCK_FOLDERS } from '@e2e/mocks/folder';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_WISHLIST_ENTRIES } from '@e2e/mocks/wish';

test('폴더 탭에 폴더 이름과 위시 개수가 보인다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);

  await page.goto('/wish?tab=folder');

  for (const folder of MOCK_FOLDERS) {
    await expect(page.getByText(folder.name, { exact: true })).toBeVisible();
    await expect(page.getByText(`위시 ${folder.wishCount}개`)).toBeVisible();
  }
});

test('폴더가 없으면 빈 상태 안내가 보인다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.FOLDERS, []);

  await setSsrEmpty(page, ENDPOINTS.FOLDERS);
  await page.goto('/wish?tab=folder');

  await expect(page.getByRole('button', { name: '폴더 추가하기' })).toBeVisible();
});

test('새 폴더 이름을 입력하면 생성 요청을 보내고 시트가 닫힌다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);
  api.post(ENDPOINTS.FOLDERS, { ...MOCK_FOLDER, id: 3, name: '코트', wishCount: 0 });

  await page.goto('/wish?tab=folder');
  await page.getByText('폴더 추가하기').click();
  await page.getByRole('textbox', { name: '폴더명' }).fill('코트');

  const createRequest = page.waitForRequest(
    request => request.method() === 'POST' && request.url().endsWith(ENDPOINTS.FOLDERS)
  );
  await page.getByRole('button', { name: '완료' }).click();

  expect((await createRequest).postDataJSON()).toEqual({ name: '코트' });
  await expect(page.getByRole('textbox', { name: '폴더명' })).toBeHidden();
});

test('같은 이름의 폴더가 있으면 시트 안에 안내 문구가 보인다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);
  api.error('POST', ENDPOINTS.FOLDERS, { status: 409, code: ERROR_CODE.FOLDER_DUPLICATE_NAME });

  await page.goto('/wish?tab=folder');
  await page.getByText('폴더 추가하기').click();
  await page.getByRole('textbox', { name: '폴더명' }).fill(MOCK_FOLDER.name);
  await page.getByRole('button', { name: '완료' }).click();

  await expect(page.getByText('같은 이름의 폴더가 이미 있어요.')).toBeVisible();
  await expect(page.getByRole('textbox', { name: '폴더명' })).toBeVisible();
});

test('폴더 이름을 바꾸면 변경 요청을 보낸다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);
  api.patch(ENDPOINTS.FOLDER(MOCK_FOLDER.id), { ...MOCK_FOLDER, name: '코트' });

  await page.goto('/wish?tab=folder');
  await page.getByRole('button', { name: `${MOCK_FOLDER.name} 폴더 메뉴` }).click();
  await page.getByText('폴더명 변경하기').click();
  await page.getByRole('textbox', { name: '폴더명' }).fill('코트');

  const renameRequest = page.waitForRequest(
    request =>
      request.method() === 'PATCH' && request.url().endsWith(ENDPOINTS.FOLDER(MOCK_FOLDER.id))
  );
  await page.getByRole('button', { name: '완료' }).click();

  expect((await renameRequest).postDataJSON()).toEqual({ name: '코트' });
});

test('폴더를 삭제하면 삭제 요청을 보내고 확인창이 닫힌다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);
  api.delete(ENDPOINTS.FOLDER(MOCK_FOLDER.id), null);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);

  await page.goto('/wish?tab=folder');
  await page.getByRole('button', { name: `${MOCK_FOLDER.name} 폴더 메뉴` }).click();
  await page.getByText('삭제하기').click();

  const deleteRequest = page.waitForRequest(
    request =>
      request.method() === 'DELETE' && request.url().endsWith(ENDPOINTS.FOLDER(MOCK_FOLDER.id))
  );
  await page.getByRole('dialog').getByRole('button', { name: '삭제하기' }).click();
  await deleteRequest;

  await expect(page.getByRole('dialog')).toBeHidden();
});
