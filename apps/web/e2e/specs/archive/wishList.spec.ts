import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { setSsrEmpty } from '@e2e/helpers/ssrEmpty';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_WISHLIST_ENTRIES } from '@e2e/mocks/wish';

const [FIRST_ENTRY, SECOND_ENTRY, ...REST_ENTRIES] = MOCK_WISHLIST_ENTRIES;

test('회원이 진입하면 위시 카드가 렌더링된다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);

  await page.goto('/archive/wish');

  await expect(page.getByRole('heading', { name: '내 위시리스트' })).toBeVisible();
  for (const { item } of MOCK_WISHLIST_ENTRIES) {
    await expect(page.getByRole('link', { name: item.name ?? '' })).toBeVisible();
  }
  await expect(page.getByText('10,000원')).toBeVisible();
});

test('위시가 없으면 빈 상태가 렌더링된다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.getPage(ENDPOINTS.WISHLISTS, []);

  await setSsrEmpty(page, ENDPOINTS.WISHLISTS);
  await page.goto('/archive/wish');

  await expect(page.getByText('아직 담긴 위시가 없어요')).toBeVisible();
});

test('삭제 모드에서 선택한 위시만 삭제된다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);

  await page.goto('/archive/wish');
  await page.getByRole('button', { name: '삭제', exact: true }).click();

  await expect(page.getByRole('button', { name: '선택한 0개의 상품 삭제' })).toBeDisabled();

  for (const entry of [FIRST_ENTRY!, SECOND_ENTRY!]) {
    const card = page.getByRole('button', { name: entry.item.name ?? '' });
    await card.click();
    await expect(card).toHaveAttribute('aria-pressed', 'true');
  }

  await page.getByRole('button', { name: '선택한 2개의 상품 삭제' }).click();
  await expect(page.getByRole('dialog', { name: '상품을 정말 삭제할까요?' })).toBeVisible();

  api.delete(ENDPOINTS.WISHLISTS, null);
  api.getPage(ENDPOINTS.WISHLISTS, REST_ENTRIES);

  const deleteRequest = page.waitForRequest(
    request => request.method() === 'DELETE' && request.url().includes(ENDPOINTS.WISHLISTS)
  );
  await page.getByRole('dialog').getByRole('button', { name: '삭제하기' }).click();

  const ids = new URL((await deleteRequest).url()).searchParams.get('ids')?.split(',').sort();
  expect(ids).toEqual([String(FIRST_ENTRY!.wish.id), String(SECOND_ENTRY!.wish.id)]);

  await expect(page.getByText('선택한 위시를 삭제했어요')).toBeVisible();
  await expect(page.getByRole('link', { name: FIRST_ENTRY!.item.name ?? '' })).toHaveCount(0);
  for (const { item } of REST_ENTRIES) {
    await expect(page.getByRole('link', { name: item.name ?? '' })).toBeVisible();
  }
});
