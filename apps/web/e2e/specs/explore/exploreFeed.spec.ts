import { ENDPOINTS } from '@/consts/api';
import { ROUTES } from '@/consts/route';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { setSsrEmpty } from '@e2e/helpers/ssrEmpty';
import { MOCK_FRIEND_WISHES, createRecentWishes } from '@e2e/mocks/explore';

test('방금 담긴 위시는 서버 갱신 시각과 카드를 보여주고 카드는 위시 상세로 이어진다', async ({
  page,
  api,
}) => {
  const recentWishes = createRecentWishes();
  api.get(ENDPOINTS.EXPLORE_FRIENDS, MOCK_FRIEND_WISHES);
  api.get(ENDPOINTS.EXPLORE_RECENT, recentWishes);

  await page.goto(ROUTES.EXPLORE);

  const recentSection = page.locator('section').filter({
    has: page.getByRole('heading', { name: '방금 담긴 위시' }),
  });
  await expect(recentSection.getByText(/^\d+분 전 업데이트$/)).toBeVisible();
  for (const { wishId, item } of recentWishes.wishes) {
    const card = recentSection.getByRole('link').filter({ hasText: item.name });
    await expect(card).toHaveAttribute('href', ROUTES.EXPLORE_WISH(wishId));
  }
  await expect(recentSection.getByRole('button', { name: '내 위시에 담긴 상품' })).toHaveCount(1);
});

test('친구가 담은 위시는 친구 닉네임과 함께 보여준다', async ({ page, api }) => {
  api.get(ENDPOINTS.EXPLORE_FRIENDS, MOCK_FRIEND_WISHES);
  api.get(ENDPOINTS.EXPLORE_RECENT, createRecentWishes());

  await page.goto(ROUTES.EXPLORE);

  const friendSection = page.locator('section').filter({
    has: page.getByRole('heading', { name: '친구가 담은 위시' }),
  });
  const [friendWish] = MOCK_FRIEND_WISHES.wishes;
  const card = friendSection.getByRole('link').filter({ hasText: friendWish?.item.name ?? '' });
  await expect(card).toHaveAttribute('href', ROUTES.EXPLORE_WISH(friendWish?.wishId ?? 0));
  await expect(card.getByText(friendWish?.friend.nickname ?? '')).toBeVisible();
});

test('친구가 담은 위시가 없으면 그 섹션만 숨긴다', async ({ page, api }) => {
  await setSsrEmpty(page, ENDPOINTS.EXPLORE_FRIENDS);
  api.get(ENDPOINTS.EXPLORE_FRIENDS, { friends: [], wishes: [] });
  api.get(ENDPOINTS.EXPLORE_RECENT, createRecentWishes());

  await page.goto(ROUTES.EXPLORE);

  await expect(page.getByRole('heading', { name: '방금 담긴 위시' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '친구가 담은 위시' })).toHaveCount(0);
});

test('방금 담긴 위시가 없으면 그 섹션만 숨긴다', async ({ page, api }) => {
  await setSsrEmpty(page, ENDPOINTS.EXPLORE_RECENT);
  api.get(ENDPOINTS.EXPLORE_FRIENDS, MOCK_FRIEND_WISHES);
  api.get(ENDPOINTS.EXPLORE_RECENT, { updatedAt: null, wishes: [] });

  await page.goto(ROUTES.EXPLORE);

  await expect(page.getByRole('heading', { name: '친구가 담은 위시' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '방금 담긴 위시' })).toHaveCount(0);
});
