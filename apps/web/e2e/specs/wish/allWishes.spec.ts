import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_FOLDER, MOCK_FOLDERS } from '@e2e/mocks/folder';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_WISHLIST_ENTRIES } from '@e2e/mocks/wish';

const [FIRST_ENTRY] = MOCK_WISHLIST_ENTRIES;
const FIRST_WISH_NAME = FIRST_ENTRY?.item.name ?? '';
const FIRST_WISH_ID = FIRST_ENTRY?.wish.id ?? 0;

test('전체 위시 탭에 위시 카드가 보인다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);

  await page.goto('/wish');

  for (const { item } of MOCK_WISHLIST_ENTRIES) {
    await expect(page.getByText(item.name ?? '', { exact: true })).toBeVisible();
  }
  await expect(page.getByText(`상품 ${MOCK_WISHLIST_ENTRIES.length}`)).toBeVisible();
});

test('편집 모드에서 위시를 골라 삭제하면 삭제 요청을 보낸다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.delete(ENDPOINTS.WISHLISTS, null);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);

  await page.goto('/wish');
  await page.getByRole('button', { name: '편집' }).click();
  await page.getByRole('button', { name: FIRST_WISH_NAME }).first().click();
  await page.getByRole('button', { name: '삭제', exact: true }).click();

  const deleteRequest = page.waitForRequest(
    request => request.method() === 'DELETE' && request.url().includes(ENDPOINTS.WISHLISTS)
  );
  await page.getByRole('dialog').getByRole('button', { name: '삭제하기' }).click();

  expect(new URL((await deleteRequest).url()).searchParams.get('ids')).toBe(String(FIRST_WISH_ID));
  await expect(page.getByText('상품 1개를 삭제했어요.')).toBeVisible();
});

test('편집 모드에서 폴더를 고르면 그 폴더에 위시를 담는다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.FOLDER_WISHES(MOCK_FOLDER.id), { folderId: MOCK_FOLDER.id, wishCount: 8 });
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);

  await page.goto('/wish');
  await page.getByRole('button', { name: '편집' }).click();
  await page.getByRole('button', { name: FIRST_WISH_NAME }).first().click();
  await page.getByRole('button', { name: '폴더 이동' }).click();

  const addRequest = page.waitForRequest(
    request =>
      request.method() === 'POST' && request.url().endsWith(ENDPOINTS.FOLDER_WISHES(MOCK_FOLDER.id))
  );
  await page.getByRole('button', { name: new RegExp(MOCK_FOLDER.name) }).click();

  expect((await addRequest).postDataJSON()).toEqual({ wishIds: [FIRST_WISH_ID] });
  await expect(page.getByText(`상품을 '${MOCK_FOLDER.name}' 폴더로 이동했어요.`)).toBeVisible();
});

test('검색어를 입력하면 검색어로 위시를 조회해 결과를 보여준다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.getPage(ENDPOINTS.WISHLISTS, [FIRST_ENTRY]);

  await page.goto('/wish');
  await page.getByRole('button', { name: '검색' }).click();

  const searchInput = page.getByRole('textbox', { name: '상품명 검색' });
  await searchInput.fill('스니커즈');

  const searchRequest = page.waitForRequest(
    request => request.method() === 'GET' && request.url().includes('q=')
  );
  await searchInput.press('Enter');

  expect(new URL((await searchRequest).url()).searchParams.get('q')).toBe('스니커즈');
  await expect(page.getByText('검색 결과 1개')).toBeVisible();
  await expect(page.getByRole('dialog').getByText(FIRST_WISH_NAME, { exact: true })).toBeVisible();
});
