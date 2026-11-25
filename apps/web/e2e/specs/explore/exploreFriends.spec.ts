import { ENDPOINTS } from '@/consts/api';
import { ROUTES } from '@/consts/route';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { setSsrEmpty } from '@e2e/helpers/ssrEmpty';
import { MOCK_FRIEND_WISHES } from '@e2e/mocks/explore';

test('친구 칩을 누르면 그 친구가 담은 위시만 다시 조회한다', async ({ page, api }) => {
  api.get(ENDPOINTS.EXPLORE_FRIENDS, MOCK_FRIEND_WISHES);
  const [friend] = MOCK_FRIEND_WISHES.friends;
  const [friendWish] = MOCK_FRIEND_WISHES.wishes;

  await page.goto(ROUTES.EXPLORE_FRIENDS);

  const card = page.getByRole('link').filter({ hasText: friendWish?.item.name ?? '' });
  await expect(card).toHaveAttribute('href', ROUTES.EXPLORE_WISH(friendWish?.wishId ?? 0));

  const filteredRequest = page.waitForRequest(request => {
    const url = new URL(request.url());
    return (
      url.pathname === ENDPOINTS.EXPLORE_FRIENDS &&
      url.searchParams.get('friendId') === friend?.userId
    );
  });
  await page.getByRole('button', { name: friend?.nickname }).click();

  await filteredRequest;
  await expect(page.getByRole('button', { name: friend?.nickname })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page).toHaveURL(new RegExp(`friend=${friend?.userId}`));
});

test('친구가 담은 위시가 없으면 빈 화면을 보여준다', async ({ page, api }) => {
  await setSsrEmpty(page, ENDPOINTS.EXPLORE_FRIENDS);
  api.get(ENDPOINTS.EXPLORE_FRIENDS, { friends: [], wishes: [] });

  await page.goto(ROUTES.EXPLORE_FRIENDS);

  await expect(page.getByText('아직 친구가 담은 위시가 없어요')).toBeVisible();
  await expect(page.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true');
});
