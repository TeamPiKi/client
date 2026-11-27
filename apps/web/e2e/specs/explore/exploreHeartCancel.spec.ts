import { ERROR_CODE, getErrorMessageByCode } from '@piki/core';

import { ENDPOINTS } from '@/consts/api';
import { ROUTES } from '@/consts/route';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_EXPLORE_PICKS, createRecentWishes } from '@e2e/mocks/explore';

const SAVED_RECENT_WISH = createRecentWishes().wishes.find(({ saved }) => saved)!;
const [MAIN_PICK] = MOCK_EXPLORE_PICKS.picks;

const isRequest =
  (method: string, path: string) => (request: { method(): string; url(): string }) =>
    request.method() === method && new URL(request.url()).pathname === path;

test('채워진 하트를 누르면 내 위시를 삭제하고 빈 하트로 바꾼다', async ({ page, api }) => {
  const deletePath = ENDPOINTS.WISHLIST(SAVED_RECENT_WISH.savedWishId!);
  api.delete(deletePath, null);
  await page.goto(ROUTES.EXPLORE);

  const savedHeart = page.getByRole('button', { name: '내 위시에 담긴 상품' });
  await expect(savedHeart).toHaveCount(1);
  const deleteRequest = page.waitForRequest(isRequest('DELETE', deletePath));
  await savedHeart.click();

  await deleteRequest;
  await expect(page.getByText('내 위시에서 뺐어요')).toBeVisible();
  await expect(page.getByRole('button', { name: '내 위시에 담긴 상품' })).toHaveCount(0);
});

test('담기 취소에 실패하면 하트를 채운 채 두고 에러를 알린다', async ({ page, api }) => {
  api.error('DELETE', ENDPOINTS.WISHLIST(SAVED_RECENT_WISH.savedWishId!), {
    status: 403,
    code: ERROR_CODE.WISH_FORBIDDEN_ITEMS,
  });
  await page.goto(ROUTES.EXPLORE);

  await page.getByRole('button', { name: '내 위시에 담긴 상품' }).click();

  await expect(
    page.getByText(getErrorMessageByCode(ERROR_CODE.WISH_FORBIDDEN_ITEMS)!)
  ).toBeVisible();
  await expect(page.getByRole('button', { name: '내 위시에 담긴 상품' })).toHaveCount(1);
});

test('하트로 담은 뒤 다시 누르면 방금 담은 위시를 삭제하고 다시 담을 수 있다', async ({
  page,
  api,
}) => {
  const copyPath = ENDPOINTS.EXPLORE_PICK_CANDIDATE_COPY(MAIN_PICK!.pickId, MAIN_PICK!.candidateId);
  const savedWishId = 9101;
  const deletePath = ENDPOINTS.WISHLIST(savedWishId);
  api.post(copyPath, { wishId: savedWishId, alreadySaved: false });
  api.delete(deletePath, null);
  await page.goto(ROUTES.EXPLORE_WINNERS);

  const heart = page
    .getByRole('listitem')
    .filter({ hasText: MAIN_PICK!.item.name })
    .getByRole('button');

  const copyRequest = page.waitForRequest(isRequest('POST', copyPath));
  await heart.click();
  await copyRequest;
  await expect(heart).toHaveAttribute('aria-pressed', 'true');

  const deleteRequest = page.waitForRequest(isRequest('DELETE', deletePath));
  await heart.click();
  await deleteRequest;
  await expect(heart).toHaveAttribute('aria-pressed', 'false');

  const copyAgainRequest = page.waitForRequest(isRequest('POST', copyPath));
  await heart.click();
  await copyAgainRequest;
  await expect(heart).toHaveAttribute('aria-pressed', 'true');
});
