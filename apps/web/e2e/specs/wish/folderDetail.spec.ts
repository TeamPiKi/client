import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_FOLDER, MOCK_FOLDERS } from '@e2e/mocks/folder';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_WISHLIST_ENTRIES, MOCK_WISH_ADDED_BY_LINK } from '@e2e/mocks/wish';

const [FIRST_ENTRY] = MOCK_WISHLIST_ENTRIES;
const FIRST_WISH_NAME = FIRST_ENTRY?.item.name ?? '';
const FIRST_WISH_ID = FIRST_ENTRY?.wish.id ?? 0;
const OTHER_FOLDER = MOCK_FOLDERS.find(({ id }) => id !== MOCK_FOLDER.id);
const FOLDER_PATH = `/wish/folder/${MOCK_FOLDER.id}`;

test('폴더 상세에 폴더 이름 · 상품 개수 · 위시가 보인다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);

  await page.goto(FOLDER_PATH);

  await expect(page.getByRole('heading', { name: MOCK_FOLDER.name })).toBeVisible();
  await expect(page.getByText(`상품 ${MOCK_FOLDER.wishCount}`)).toBeVisible();
  await expect(page.getByText(FIRST_WISH_NAME, { exact: true })).toBeVisible();
});

test('없는 폴더로 들어오면 안내 후 폴더 탭으로 이동한다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);

  await page.goto('/wish/folder/999');

  await expect(page).toHaveURL(/\/wish\?tab=folder$/);
  await expect(page.getByText('폴더를 찾을 수 없어요.')).toBeVisible();
});

test('편집 모드에서 고른 위시를 폴더에서 뺀다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.delete(ENDPOINTS.FOLDER_WISHES(MOCK_FOLDER.id), { folderId: MOCK_FOLDER.id, wishCount: 6 });
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);

  await page.goto(FOLDER_PATH);
  await page.getByRole('button', { name: '편집' }).click();
  await page.getByRole('button', { name: FIRST_WISH_NAME }).first().click();
  await page.getByRole('button', { name: '삭제', exact: true }).click();

  const removeRequest = page.waitForRequest(
    request =>
      request.method() === 'DELETE' &&
      request.url().endsWith(ENDPOINTS.FOLDER_WISHES(MOCK_FOLDER.id))
  );
  await page.getByRole('dialog').getByRole('button', { name: '삭제하기' }).click();

  expect((await removeRequest).postDataJSON()).toEqual({ wishIds: [FIRST_WISH_ID] });
  await expect(page.getByText('폴더에서 상품 1개를 삭제했어요.')).toBeVisible();
});

test('편집 모드에서 다른 폴더를 고르면 한 번의 요청으로 이동한다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.FOLDER_WISHES_MOVE(MOCK_FOLDER.id), {
    folderId: MOCK_FOLDER.id,
    wishCount: 6,
    targetFolderId: OTHER_FOLDER?.id,
    targetWishCount: 1,
  });
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);

  await page.goto(FOLDER_PATH);
  await page.getByRole('button', { name: '편집' }).click();
  await page.getByRole('button', { name: FIRST_WISH_NAME }).first().click();
  await page.getByRole('button', { name: '폴더 이동' }).click();

  const moveRequest = page.waitForRequest(
    request =>
      request.method() === 'POST' &&
      request.url().endsWith(ENDPOINTS.FOLDER_WISHES_MOVE(MOCK_FOLDER.id))
  );
  await page.getByRole('button', { name: new RegExp(OTHER_FOLDER?.name ?? '') }).click();

  expect((await moveRequest).postDataJSON()).toEqual({
    wishIds: [FIRST_WISH_ID],
    targetFolderId: OTHER_FOLDER?.id,
  });
  await expect(page.getByText(`상품을 '${OTHER_FOLDER?.name}' 폴더로 이동했어요.`)).toBeVisible();
});

test('내 위시에서 골라 폴더에 추가하면 폴더 상세로 돌아간다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.FOLDER_WISHES(MOCK_FOLDER.id), { folderId: MOCK_FOLDER.id, wishCount: 8 });
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);

  await page.goto(`${FOLDER_PATH}/add`);
  await page.getByRole('button', { name: FIRST_WISH_NAME }).first().click();

  const addRequest = page.waitForRequest(
    request =>
      request.method() === 'POST' && request.url().endsWith(ENDPOINTS.FOLDER_WISHES(MOCK_FOLDER.id))
  );
  await page.getByRole('button', { name: '선택한 1개의 상품 추가' }).click();

  expect((await addRequest).postDataJSON()).toEqual({ wishIds: [FIRST_WISH_ID] });
  await expect(page).toHaveURL(new RegExp(`${FOLDER_PATH}$`));
});

test('폴더 상세에서 링크로 담으면 폴더를 지정해 등록하고 화면에 머문다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.WISHLISTS, MOCK_WISH_ADDED_BY_LINK);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);

  await page.goto(FOLDER_PATH);
  await page.getByRole('button', { name: '추가', exact: true }).click();
  await page.getByRole('button', { name: /링크로 담기/ }).click();
  await page.getByLabel('링크 URL').fill('https://shop.example/items/105');

  const registerRequest = page.waitForRequest(
    request => request.method() === 'POST' && request.url().endsWith(ENDPOINTS.WISHLISTS)
  );
  await page.getByRole('button', { name: '위시리스트에 담기' }).click();

  expect((await registerRequest).postDataJSON()).toEqual({
    url: 'https://shop.example/items/105',
    folderId: MOCK_FOLDER.id,
  });
  await expect(page.getByRole('dialog', { name: '링크로 담기' })).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`${FOLDER_PATH}$`));
});
