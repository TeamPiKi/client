import { ENDPOINTS } from '@/consts/api';
import { ROUTES } from '@/consts/route';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { setSsrDelay } from '@e2e/helpers/ssrDelay';
import { setSsrStatus } from '@e2e/helpers/ssrStatus';
import {
  MOCK_EXPLORE_WISH,
  MOCK_NO_FOLDER_EXPLORE_WISH,
  MOCK_PRIVATE_EXPLORE_WISH,
  RECENT_CARD_WISH_ID,
} from '@e2e/mocks/explore';

test('위시 상세는 담은 사람 수와 담은 사람·공개 폴더를 보여준다', async ({ page }) => {
  await page.goto(ROUTES.EXPLORE_WISH(MOCK_EXPLORE_WISH.wishId));

  await expect(page.getByText(`${MOCK_EXPLORE_WISH.savedUserCount}명이 담은 상품`)).toBeVisible();
  await expect(
    page.getByRole('heading', { name: MOCK_EXPLORE_WISH.item.name ?? '' })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: `${MOCK_EXPLORE_WISH.owner?.nickname} 프로필` })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: `${MOCK_EXPLORE_WISH.owner?.folder?.name} 폴더보기` })
  ).toHaveAttribute(
    'href',
    ROUTES.EXPLORE_FOLDER(
      MOCK_EXPLORE_WISH.owner?.userId ?? '',
      MOCK_EXPLORE_WISH.owner?.folder?.folderId ?? 0
    )
  );
});

test('폴더 없는 위시는 담은 사람 카드 빈 곳을 눌러도 프로필로 이동한다', async ({ page }) => {
  const owner = MOCK_NO_FOLDER_EXPLORE_WISH.owner!;
  await page.goto(ROUTES.EXPLORE_WISH(MOCK_NO_FOLDER_EXPLORE_WISH.wishId));

  const card = page.getByRole('link', { name: `${owner.nickname} 프로필` }).locator('..');
  const box = (await card.boundingBox())!;
  await card.click({ position: { x: box.width - 24, y: box.height / 2 } });

  await expect(page).toHaveURL(ROUTES.PROFILE(owner.userId));
});

test('담은 사람을 볼 수 없으면 비공개된 유저로 보여준다', async ({ page }) => {
  await page.goto(ROUTES.EXPLORE_WISH(MOCK_PRIVATE_EXPLORE_WISH.wishId));

  await expect(page.getByText('비공개된 유저')).toBeVisible();
  await expect(page.getByText('비공개된 폴더')).toBeVisible();
});

test('볼 수 없는 위시면 서버 404 를 찾을 수 없는 화면으로 보여준다', async ({ page }) => {
  await setSsrStatus(page, `GET ${ENDPOINTS.EXPLORE_WISH(MOCK_EXPLORE_WISH.wishId)}`, 404);

  await page.goto(ROUTES.EXPLORE_WISH(MOCK_EXPLORE_WISH.wishId));

  await expect(page.getByText('페이지를 찾을 수 없어요')).toBeVisible();
});

test('내 위시로 담기를 누르면 담기를 요청하고 버튼을 비활성화한다', async ({ page, api }) => {
  api.post(ENDPOINTS.EXPLORE_WISH_COPY(MOCK_EXPLORE_WISH.wishId), {
    wishId: 9001,
    alreadySaved: false,
  });
  await page.goto(ROUTES.EXPLORE_WISH(MOCK_EXPLORE_WISH.wishId));

  const copyRequest = page.waitForRequest(
    request =>
      request.method() === 'POST' &&
      new URL(request.url()).pathname === ENDPOINTS.EXPLORE_WISH_COPY(MOCK_EXPLORE_WISH.wishId)
  );
  await page.getByRole('button', { name: '내 위시로 담기' }).click();

  await copyRequest;
  await expect(page.getByText('내 위시에 상품을 담았어요')).toBeVisible();
  await expect(page.getByRole('button', { name: '내 위시로 담기' })).toBeDisabled();
});

test('이미 가진 상품이면 이미 있다고 안내한다', async ({ page, api }) => {
  api.post(ENDPOINTS.EXPLORE_WISH_COPY(MOCK_EXPLORE_WISH.wishId), {
    wishId: 1,
    alreadySaved: true,
  });
  await page.goto(ROUTES.EXPLORE_WISH(MOCK_EXPLORE_WISH.wishId));

  await page.getByRole('button', { name: '내 위시로 담기' }).click();

  await expect(page.getByText('이미 내 위시에 있는 상품이에요')).toBeVisible();
});

test('상품 링크 배너가 상품 이미지에 가려지지 않는다', async ({ page }) => {
  await page.goto(ROUTES.EXPLORE_WISH(MOCK_EXPLORE_WISH.wishId));

  const banner = page.getByRole('link', { name: 'shop.example' });
  await expect(banner).toHaveAttribute('href', MOCK_EXPLORE_WISH.item.sourceUrl ?? '');
  await expect(page.getByRole('img', { name: MOCK_EXPLORE_WISH.item.name ?? '' })).toHaveCSS(
    'opacity',
    '1'
  );
  const isOnTop = await banner.evaluate(element => {
    const { left, top, width, height } = element.getBoundingClientRect();
    const topElement = document.elementFromPoint(left + width / 2, top + height / 2);
    return !!topElement && element.contains(topElement);
  });
  expect(isOnTop).toBe(true);
});

test('카드를 누르면 위시 정보 응답 전에도 상세 화면 틀과 스켈레톤을 먼저 보여준다', async ({
  page,
}) => {
  await page.goto(ROUTES.EXPLORE);
  await setSsrDelay(page, `GET ${ENDPOINTS.EXPLORE_WISH(RECENT_CARD_WISH_ID)}`, 3000);

  await page.locator(`a[href="${ROUTES.EXPLORE_WISH(RECENT_CARD_WISH_ID)}"]`).click();

  await expect(page).toHaveURL(ROUTES.EXPLORE_WISH(RECENT_CARD_WISH_ID), { timeout: 2000 });
  await expect(page.getByRole('heading', { name: '위시 정보' })).toBeVisible();
  await expect(page.locator('[aria-busy]')).toBeVisible();

  await expect(page.getByText(`${MOCK_EXPLORE_WISH.savedUserCount}명이 담은 상품`)).toBeVisible({
    timeout: 8000,
  });
  await expect(page.locator('[aria-busy]')).toHaveCount(0);
});
