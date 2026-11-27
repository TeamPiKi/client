import { ENDPOINTS } from '@/consts/api';
import { ROUTES } from '@/consts/route';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { setSsrStatus } from '@e2e/helpers/ssrStatus';
import { MOCK_EXPLORE_FOLDER, MOCK_FOLDER_OWNER_ID } from '@e2e/mocks/explore';

const FOLDER_PATH = ENDPOINTS.PROFILE_FOLDER(MOCK_FOLDER_OWNER_ID, MOCK_EXPLORE_FOLDER.folderId);
const PAGE_PATH = ROUTES.EXPLORE_FOLDER(MOCK_FOLDER_OWNER_ID, MOCK_EXPLORE_FOLDER.folderId);

test('공개 폴더면 폴더 이름과 위시 카드를 보여주고 카드는 위시 상세로 이어진다', async ({
  page,
  api,
}) => {
  api.get(FOLDER_PATH, MOCK_EXPLORE_FOLDER);

  await page.goto(PAGE_PATH);

  await expect(page.getByRole('heading', { name: MOCK_EXPLORE_FOLDER.name })).toBeVisible();
  for (const { wishId, item } of MOCK_EXPLORE_FOLDER.wishes) {
    const card = page.getByRole('link').filter({ hasText: item.name ?? '' });
    await expect(card).toHaveAttribute('href', ROUTES.EXPLORE_WISH(wishId));
  }
});

test('이미 내 위시에 있는 상품은 처음부터 하트가 채워져 있다', async ({ page, api }) => {
  api.get(FOLDER_PATH, MOCK_EXPLORE_FOLDER);

  await page.goto(PAGE_PATH);

  const savedHeart = page.getByRole('button', { name: '내 위시에 담긴 상품' });
  await expect(savedHeart).toHaveCount(1);
  await expect(savedHeart).toHaveAttribute('aria-pressed', 'true');
  await expect(savedHeart).toBeDisabled();
  await expect(page.getByRole('button', { name: '내 위시로 담기' })).toHaveCount(1);
});

test('볼 수 없는 폴더면 서버 404 를 안내 화면으로 보여준다', async ({ page, api }) => {
  await setSsrStatus(page, `GET ${FOLDER_PATH}`, 404, 'USER-001');
  api.error('GET', FOLDER_PATH, { status: 404, code: 'USER-001' });

  await page.goto(PAGE_PATH);

  await expect(page.getByText('볼 수 없는 폴더예요')).toBeVisible();
  await expect(page.getByRole('heading', { name: MOCK_EXPLORE_FOLDER.name })).toHaveCount(0);
});
