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

  await expect(page.getByRole('button', { name: '영수증 공유' })).toBeVisible();
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
