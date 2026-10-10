import type { Page } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import type { ApiMockT } from '@e2e/fixtures/mockApiFixture';
import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import {
  MOCK_NOTIFICATIONS_READ_RESPONSE,
  MOCK_NOTIFICATION_ANNOUNCEMENT,
  MOCK_NOTIFICATION_ITEM_PARSED,
  MOCK_NOTIFICATION_JOINED,
  MOCK_NOTIFICATION_LIST,
  MOCK_NOTIFICATION_LIST_ALL_READ,
  MOCK_NOTIFICATION_RESULT_READY,
} from '@e2e/mocks/notification';
import { MOCK_TOURNAMENT_COMPLETED, MOCK_TOURNAMENT_PENDING } from '@e2e/mocks/tournament';

const gotoNotifications = async (page: Page, api: ApiMockT) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.getPage(ENDPOINTS.NOTIFICATIONS, MOCK_NOTIFICATION_LIST);

  await page.goto('/notification');
};

const waitForReadRequest = (page: Page) =>
  page.waitForRequest(
    request => request.method() === 'POST' && request.url().includes(ENDPOINTS.NOTIFICATIONS_READ)
  );

const DESTINATIONS = [
  { notification: MOCK_NOTIFICATION_JOINED, pathname: '/tournament/1/create', highlightItem: null },
  {
    notification: MOCK_NOTIFICATION_RESULT_READY,
    pathname: '/tournament/3/result',
    highlightItem: null,
  },
  {
    notification: MOCK_NOTIFICATION_ITEM_PARSED,
    pathname: '/tournament/1/create',
    highlightItem: '11',
  },
];

for (const { notification, pathname, highlightItem } of DESTINATIONS) {
  test(`${notification.type} 알림을 누르면 읽음 처리 후 목적지로 이동한다`, async ({
    page,
    api,
  }) => {
    await gotoNotifications(page, api);
    api.post(ENDPOINTS.NOTIFICATIONS_READ, MOCK_NOTIFICATIONS_READ_RESPONSE);
    api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);
    api.get(ENDPOINTS.TOURNAMENT(3), MOCK_TOURNAMENT_COMPLETED);

    const readRequest = waitForReadRequest(page);
    /** 목적지 페이지가 highlightItem 쿼리를 읽은 뒤 URL 에서 지우므로 최종 URL 대신 네비게이션 요청으로 검증한다 */
    const navigationRequest = page.waitForRequest(request => {
      const url = new URL(request.url());
      return url.pathname === pathname && url.searchParams.get('highlightItem') === highlightItem;
    });
    await page.getByRole('button', { name: notification.title }).click();

    expect((await readRequest).postDataJSON()).toEqual({ ids: [notification.id] });
    await navigationRequest;
    /** 로컬 dev 서버의 목적지 라우트 첫 컴파일이 기본 5초를 넘길 수 있어 여유를 둔다 */
    await expect(page).toHaveURL(new RegExp(`${pathname.replaceAll('/', '\\/')}(\\?.*)?$`), {
      timeout: 15_000,
    });
  });
}

test('공지 알림은 읽음 처리만 하고 이동하지 않는다', async ({ page, api }) => {
  await gotoNotifications(page, api);
  api.post(ENDPOINTS.NOTIFICATIONS_READ, MOCK_NOTIFICATIONS_READ_RESPONSE);

  const readRequest = waitForReadRequest(page);
  await page.getByRole('button', { name: MOCK_NOTIFICATION_ANNOUNCEMENT.title }).click();

  expect((await readRequest).postDataJSON()).toEqual({ ids: [MOCK_NOTIFICATION_ANNOUNCEMENT.id] });
  await expect(page).toHaveURL(/\/notification$/);
});

test('모두 읽음을 확정하면 전체 읽음 요청 후 버튼이 사라진다', async ({ page, api }) => {
  await gotoNotifications(page, api);

  await page.getByRole('button', { name: '모두 읽음' }).click();
  await expect(
    page.getByRole('dialog', { name: '알림을 모두 읽음 처리하시겠어요?' })
  ).toBeVisible();

  api.post(ENDPOINTS.NOTIFICATIONS_READ, MOCK_NOTIFICATIONS_READ_RESPONSE);
  api.getPage(ENDPOINTS.NOTIFICATIONS, MOCK_NOTIFICATION_LIST_ALL_READ);

  const readRequest = waitForReadRequest(page);
  await page.getByRole('button', { name: '읽음 처리하기' }).click();

  expect((await readRequest).postDataJSON()).toEqual({ all: true });
  await expect(page.getByText('알림을 모두 읽음 처리했어요')).toBeVisible();
  await expect(page.getByRole('button', { name: '모두 읽음' })).toHaveCount(0);
});

test('조회에 실패하면 에러 카드가 뜨고 다시 시도로 복구된다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.error('GET', ENDPOINTS.NOTIFICATIONS, { status: 500 });

  await page.goto('/notification');
  await expect(page.getByRole('heading', { name: '알림을 불러오지 못했어요' })).toBeVisible();

  api.getPage(ENDPOINTS.NOTIFICATIONS, MOCK_NOTIFICATION_LIST);
  await page.getByRole('button', { name: '다시 시도' }).click();

  await expect(page.getByText(MOCK_NOTIFICATION_JOINED.title)).toBeVisible();
});
