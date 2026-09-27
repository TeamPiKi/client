import { ERROR_CODE } from '@piki/core';
import type { Page } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import type { ApiMockT } from '@e2e/fixtures/mockApiFixture';
import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_WISHLIST_ENTRIES, MOCK_WISH_DETAIL, MOCK_WISH_SOURCE_URL } from '@e2e/mocks/wish';

const WISH_ID = MOCK_WISH_DETAIL.wish.id;
const ORIGINAL_NAME = MOCK_WISH_DETAIL.item.name ?? '';

const gotoWishDetail = async (page: Page, api: ApiMockT) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.WISHLIST(WISH_ID), MOCK_WISH_DETAIL);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);

  await page.goto(`/archive/wish/${WISH_ID}`);
};

test('상세 정보를 확인하고 상품명을 수정해 저장하면 조회 화면에 반영된다', async ({
  page,
  api,
}) => {
  const NEW_NAME = 'E2E 러닝화';
  await gotoWishDetail(page, api);

  await expect(page.getByText('위시 정보', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: ORIGINAL_NAME })).toBeVisible();
  await expect(page.getByText('10,000원')).toBeVisible();
  await expect(page.getByRole('link', { name: 'shop.example' })).toHaveAttribute(
    'href',
    MOCK_WISH_SOURCE_URL
  );

  await page.getByRole('button', { name: '상품 정보 수정' }).click();
  await expect(page.getByText('위시 정보 수정')).toBeVisible();

  const saveButton = page.getByRole('button', { name: '저장하기' });
  await expect(saveButton).toBeDisabled();

  await page.getByLabel('상품명').fill(NEW_NAME);
  await expect(saveButton).toBeEnabled();

  const updatedItem = { ...MOCK_WISH_DETAIL.item, name: NEW_NAME };
  api.patch(ENDPOINTS.WISHLIST(WISH_ID), {
    wish: MOCK_WISH_DETAIL.wish,
    item: updatedItem,
    refreshNeeded: null,
    reused: null,
  });
  api.get(ENDPOINTS.WISHLIST(WISH_ID), { ...MOCK_WISH_DETAIL, item: updatedItem });

  const patchRequest = page.waitForRequest(
    request => request.method() === 'PATCH' && request.url().includes(ENDPOINTS.WISHLIST(WISH_ID))
  );
  await saveButton.click();

  const patchBody = (await patchRequest).postDataBuffer()?.toString() ?? '';
  expect(patchBody).toContain('name="name"');
  expect(patchBody).toContain(NEW_NAME);

  await expect(page.getByText('위시 정보', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: NEW_NAME })).toBeVisible();
});

test('삭제를 확정하면 목록으로 돌아간다', async ({ page, api }) => {
  await gotoWishDetail(page, api);
  api.delete(ENDPOINTS.WISHLIST(WISH_ID), null);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES.slice(1));

  await page.getByRole('button', { name: '삭제하기' }).click();
  await expect(page.getByRole('dialog', { name: '위시를 삭제할까요?' })).toBeVisible();

  await page.getByRole('dialog').getByRole('button', { name: '삭제하기' }).click();

  await expect(page.getByText('위시 상품이 삭제되었습니다.')).toBeVisible();
  await expect(page).toHaveURL(/\/archive\/wish$/);
});

test('가격 새로고침에 성공하면 새 가격이 표시된다', async ({ page, api }) => {
  await gotoWishDetail(page, api);
  api.post(ENDPOINTS.WISHLIST_REFRESH(WISH_ID), null);
  api.get(ENDPOINTS.WISHLIST(WISH_ID), {
    ...MOCK_WISH_DETAIL,
    item: { ...MOCK_WISH_DETAIL.item, price: 8000 },
  });

  await page.getByRole('button', { name: '가격 정보 새로고침' }).click();

  await expect(page.getByText('8,000원')).toBeVisible();
});

test('가격 새로고침에 실패하면 안내 후 직접 수정으로 이어진다', async ({ page, api }) => {
  await gotoWishDetail(page, api);
  api.error('POST', ENDPOINTS.WISHLIST_REFRESH(WISH_ID), {
    status: 400,
    code: ERROR_CODE.WISH_NOT_REFRESHABLE,
  });

  await page.getByRole('button', { name: '가격 정보 새로고침' }).click();
  await expect(
    page.getByRole('dialog', { name: '가격 정보를 불러오는 데 실패했어요' })
  ).toBeVisible();

  await page.getByRole('button', { name: '직접 수정하기' }).click();

  await expect(page.getByText('위시 정보 수정')).toBeVisible();
  await expect(page.getByLabel('상품명')).toHaveValue(ORIGINAL_NAME);
});
