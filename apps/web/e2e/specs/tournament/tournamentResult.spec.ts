import { WEBVIEW_UA_TOKEN } from '@piki/core';

import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import {
  MOCK_TOURNAMENT_COMPLETED,
  MOCK_TOURNAMENT_LIST,
  MOCK_TOURNAMENT_RESULT,
} from '@e2e/mocks/tournament';

/**
 * 솔로 토너먼트 3단계 — 영수증 결과 화면 (id 3, SSR 목 = COMPLETED).
 *
 * 영수증 이미지 실제 저장(html-to-image + Web Share)과 공유 동작은 headless 환경이
 * 실제 유저 환경(모바일 공유 시트)을 대변하지 못해 버튼 노출까지만 검증한다.
 */
test('결과 페이지에 영수증과 순위, 공유 버튼이 렌더링된다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(3), MOCK_TOURNAMENT_COMPLETED);

  await page.goto('/tournament/3/result');

  await expect(page.getByText('토너먼트 결과')).toBeVisible();

  /**
   * 영수증에 1~4위 상품명이 모두 표시된다 (영수증 뽑기 애니메이션은 auto-waiting 으로 흡수).
   * ReceiptPaper 는 레이아웃 확보용 invisible 사본이 먼저 렌더되므로 실제 사본은 last().
   */
  for (const rankedItem of MOCK_TOURNAMENT_RESULT) {
    await expect(page.getByText(rankedItem.name).last()).toBeVisible();
  }

  await expect(page.getByRole('button', { name: '영수증 저장' })).toBeVisible();
  /** isRoot && isOwner — 플레이 링크 공유 버튼 노출 */
  await expect(page.getByRole('button', { name: '토너먼트 공유' })).toBeVisible();
});

test('결과 페이지에서 홈으로 가기를 누르면 홈으로 이동한다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(3), MOCK_TOURNAMENT_COMPLETED);
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);

  await page.goto('/tournament/3/result');
  await page.getByRole('link', { name: '홈으로 가기' }).click();

  await expect(page).toHaveURL('/home');
});

/**
 * 스토리 공유는 네이티브 전용이라 웹 브라우저에서는 버튼 자체가 없어야 한다.
 * 앱에서의 노출은 아래 웹뷰 UA 테스트에서 검증한다.
 */
test('웹 브라우저에서는 공유 시트에 스토리 공유 버튼이 없다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(3), MOCK_TOURNAMENT_COMPLETED);

  await page.goto('/tournament/3/result');
  await page.getByRole('button', { name: '영수증 공유' }).click();

  await expect(page.getByRole('button', { name: '이미지 저장' })).toBeVisible();
  await expect(page.getByRole('button', { name: '스토리 공유' })).toBeHidden();
});

test.describe('앱(웹뷰) 환경', () => {
  /**
   * 모든 BRIDGE_GATE 기준과 앱 업데이트 유도 targetVersion 을 넘는 최신 앱을 시뮬레이션한다.
   * 낮은 버전이면 업데이트 유도 모달이 화면을 가리고, APP_UPDATE_PROMPT 는 SVG 를 import 해서 spec 에서 못 읽는다.
   */
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
    await page.getByRole('button', { name: '영수증 공유' }).click();

    const storyButton = page.getByRole('button', { name: '스토리 공유' });
    await expect(storyButton).toBeEnabled();
    await storyButton.click();

    await expect(
      page.getByText('인스타그램 앱을 설치하면 스토리에 공유할 수 있어요.')
    ).toBeVisible();
  });
});
