import { ERROR_CODE, ERROR_MESSAGE_MAP } from '@piki/core';
import type { Page } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import type { ApiMockT } from '@e2e/fixtures/mockApiFixture';
import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_WISHLIST_ENTRIES, MOCK_WISH_ADDED_BY_LINK } from '@e2e/mocks/wish';

const ADDED_URL = MOCK_WISH_ADDED_BY_LINK.item.sourceUrl ?? '';

const openLinkDialog = async (page: Page, api: ApiMockT) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);

  await page.goto('/archive/wish');
  await page.getByRole('button', { name: '아이템 추가하기' }).click();
  await expect(page.getByRole('dialog', { name: '위시 담기' })).toBeVisible();
  await page.getByRole('button', { name: /링크로 담기/ }).click();
  await expect(page.getByRole('dialog', { name: '링크로 담기' })).toBeVisible();
};

test('링크를 입력해 담으면 다이얼로그가 닫히고 목록에 추가된다', async ({ page, api }) => {
  await openLinkDialog(page, api);

  const submitButton = page.getByRole('button', { name: '위시리스트에 담기' });
  await expect(submitButton).toBeDisabled();

  await page.getByLabel('링크 URL').fill(ADDED_URL);

  api.post(ENDPOINTS.WISHLISTS, MOCK_WISH_ADDED_BY_LINK);
  api.getPage(ENDPOINTS.WISHLISTS, [...MOCK_WISHLIST_ENTRIES, MOCK_WISH_ADDED_BY_LINK]);

  const postRequest = page.waitForRequest(
    request => request.method() === 'POST' && request.url().includes(ENDPOINTS.WISHLISTS)
  );
  await submitButton.click();
  expect((await postRequest).postDataJSON()).toEqual({ url: ADDED_URL });

  await expect(page.getByRole('dialog', { name: '링크로 담기' })).toBeHidden();
  await expect(
    page.getByRole('link', { name: MOCK_WISH_ADDED_BY_LINK.item.name ?? '' })
  ).toBeVisible();
});

test('상품 설명과 섞인 텍스트는 URL 만 전송한다', async ({ page, api }) => {
  await openLinkDialog(page, api);
  await page.getByLabel('링크 URL').fill(`E2E 코트 특가 ${ADDED_URL} 놓치지 마세요`);

  api.post(ENDPOINTS.WISHLISTS, MOCK_WISH_ADDED_BY_LINK);

  const postRequest = page.waitForRequest(
    request => request.method() === 'POST' && request.url().includes(ENDPOINTS.WISHLISTS)
  );
  await page.getByRole('button', { name: '위시리스트에 담기' }).click();
  expect((await postRequest).postDataJSON()).toEqual({ url: ADDED_URL });
});

test('이미 담긴 상품이면 안내 토스트를 띄우고 다이얼로그를 닫는다', async ({ page, api }) => {
  await openLinkDialog(page, api);
  api.error('POST', ENDPOINTS.WISHLISTS, { status: 409, code: ERROR_CODE.WISH_ALREADY_EXISTS });

  await page.getByLabel('링크 URL').fill(ADDED_URL);
  await page.getByRole('button', { name: '위시리스트에 담기' }).click();

  await expect(page.getByText(ERROR_MESSAGE_MAP[ERROR_CODE.WISH_ALREADY_EXISTS])).toBeVisible();
  await expect(page.getByRole('dialog', { name: '링크로 담기' })).toBeHidden();
});
