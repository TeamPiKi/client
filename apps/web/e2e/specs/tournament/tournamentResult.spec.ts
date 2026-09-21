import { WEBVIEW_UA_TOKEN } from '@piki/core';

import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { applyGuestToken } from '@e2e/helpers/guestToken';
import { MOCK_GUEST_ME, MOCK_MEMBER_ME } from '@e2e/mocks/me';
import {
  MOCK_TOURNAMENT_COMPLETED,
  MOCK_TOURNAMENT_GROUP_COMPLETED,
  MOCK_TOURNAMENT_LIST,
  MOCK_TOURNAMENT_RESULT,
} from '@e2e/mocks/tournament';

test('결과 페이지에 영수증과 순위, 공유 버튼이 렌더링된다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(3), MOCK_TOURNAMENT_COMPLETED);

  await page.goto('/tournament/3/result');

  await expect(page.getByText('토너먼트 결과')).toBeVisible();

  for (const rankedItem of MOCK_TOURNAMENT_RESULT) {
    await expect(page.getByText(rankedItem.name).last()).toBeVisible();
  }

  await expect(page.getByRole('button', { name: '영수증 저장' })).toBeVisible();
  /** isOwner — 플레이 링크 공유 버튼 노출 */
  await expect(page.getByRole('button', { name: '토너먼트 공유' })).toBeVisible();

  await expect(page.getByRole('link', { name: '전체 결과 보기' })).toBeHidden();
});

test('소셜 토너먼트는 친구가 완주하기 전에도 전체 결과 보기 배너가 노출된다', async ({
  page,
  api,
}) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(4), MOCK_TOURNAMENT_GROUP_COMPLETED);

  await page.goto('/tournament/4/result');

  await expect(page.getByRole('link', { name: '전체 결과 보기' })).toBeVisible();
});

test('결과 페이지에서 홈으로 가기를 누르면 홈으로 이동한다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(3), MOCK_TOURNAMENT_COMPLETED);
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);

  await page.goto('/tournament/3/result');
  await page.getByRole('link', { name: '홈으로 가기' }).click();

  await expect(page).toHaveURL('/home');
});

test('웹 브라우저에서는 공유 시트에 스토리 공유 버튼이 없다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(3), MOCK_TOURNAMENT_COMPLETED);

  await page.goto('/tournament/3/result');
  await page.getByRole('button', { name: '영수증 저장' }).click();

  await expect(page.getByRole('button', { name: '공유하기', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '스토리로 바로 공유하기' })).toBeHidden();
});

test.describe('앱(웹뷰) 환경', () => {
  test.use({ userAgent: `Mozilla/5.0 ${WEBVIEW_UA_TOKEN}/99.0.0` });

  test('스토리 공유 버튼이 노출되고, 인스타그램 미설치면 안내 토스트를 띄운다', async ({
    page,
    api,
  }) => {
    api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
    api.get(ENDPOINTS.TOURNAMENT(3), MOCK_TOURNAMENT_COMPLETED);

    /** 앱 환경에서만 백엔드 SSE 를 직접 구독한다 — 빈 스트림으로 막아 실서버 접근 차단 */
    await page.route(`**${ENDPOINTS.NOTIFICATIONS_SUBSCRIBE}`, route =>
      route.fulfill({ status: 200, headers: { 'content-type': 'text/event-stream' }, body: '' })
    );

    /** 앱이 없는 환경이라 브릿지를 흉내낸다 — 웹이 보낸 요청에 notInstalled 로 응답 */
    await page.addInitScript(() => {
      Object.defineProperty(window, 'ReactNativeWebView', {
        value: {
          postMessage: (raw: string) => {
            const message = JSON.parse(raw);
            if (message.type !== 'WEB_REQ_SHARE_INSTAGRAM_STORY') return;

            window.dispatchEvent(
              new MessageEvent('message', {
                data: JSON.stringify({
                  type: 'APP_RES_SHARE_INSTAGRAM_STORY',
                  payload: { requestId: message.payload.requestId, status: 'notInstalled' },
                }),
              })
            );
          },
        },
      });
    });

    await page.goto('/tournament/3/result');
    await page.getByRole('button', { name: '영수증 저장' }).click();

    const storyButton = page.getByRole('button', { name: '스토리로 바로 공유하기' });
    await expect(storyButton).toBeEnabled();
    await storyButton.click();

    await expect(
      page.getByText('인스타그램 앱을 설치하면 스토리에 공유할 수 있어요.')
    ).toBeVisible();
  });
});

test('게스트가 영수증 저장을 누르면 로그인 유도 화면이 뜬다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);
  api.get(ENDPOINTS.TOURNAMENT(3), MOCK_TOURNAMENT_COMPLETED);
  await applyGuestToken(page);

  await page.goto('/tournament/3/result');
  await page.getByRole('button', { name: '영수증 저장' }).click();

  await expect(
    page.getByRole('heading', { name: '로그인하고 영수증을 저장해보세요' })
  ).toBeVisible();

  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.getByRole('button', { name: '로그인하기' }).click();
  await expect(page).toHaveURL(/\/login\?redirect=%2Ftournament%2F3%2Fresult/);
});
