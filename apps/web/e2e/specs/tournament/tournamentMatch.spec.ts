import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import {
  MOCK_TOURNAMENT_IN_PROGRESS,
  MOCK_TOURNAMENT_IN_PROGRESS_FINAL,
  MOCK_TOURNAMENT_RESULT,
} from '@e2e/mocks/tournament';

/**
 * 솔로 토너먼트 2단계 — 4강부터 결승까지 매치 진행 (id 2, SSR 목 = IN_PROGRESS).
 *
 * 결승 선택 후 result 페이지로 push 되지만, id 2 의 SSR 목이 IN_PROGRESS 고정이라
 * 서버가 match 로 되돌린다 — 결과 화면 렌더는 tournamentResult.spec(id 3) 에서 검증하고,
 * 여기서는 결승 기록 요청이 올바른 payload 로 나가는 것까지만 단언한다.
 *
 * 카드 페어는 마운트 후 셔플되므로(pairItems.ts) 좌/우 순서·조합에 의존하지 않고
 * "보이는 후보 카드 중 첫 번째" 를 선택한다.
 */
test('4강 두 매치를 진행하면 결승으로 전환되고, 결승 선택이 기록된다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(2), MOCK_TOURNAMENT_IN_PROGRESS);
  api.post(ENDPOINTS.TOURNAMENT_MATCHES(2), null);

  await page.goto('/tournament/2/match');

  const candidateCard = page.getByRole('button', { name: /E2E/ });

  /** 4강 1번째 매치 — 낙관적 진행으로 바로 다음 매치 */
  await expect(page.getByText('4강 라운드 1')).toBeVisible();
  await candidateCard.first().click();

  /** 4강 2번째(라운드 마지막) 매치 — 기록 후 서버 재조회로 결승 라운드 진입 */
  await expect(page.getByText('4강 라운드 2')).toBeVisible();
  api.get(ENDPOINTS.TOURNAMENT(2), MOCK_TOURNAMENT_IN_PROGRESS_FINAL);
  await candidateCard.first().click();

  /** 결승 전환 바텀시트(3초 카운트다운 후 자동 종료) → 결승전 화면 */
  await expect(page.getByText('마지막 한 판!')).toBeVisible();
  await expect(page.getByText('결승전')).toBeVisible();
  await expect(page.getByText('최종 선택을 해주세요')).toBeVisible();

  /** 결승 기록 — 1~4위 결과가 함께 반환된다 */
  api.post(ENDPOINTS.TOURNAMENT_MATCHES(2), { result: MOCK_TOURNAMENT_RESULT });
  const finalMatchRequest = page.waitForRequest(
    request =>
      request.method() === 'POST' && request.url().includes(ENDPOINTS.TOURNAMENT_MATCHES(2))
  );
  await candidateCard.first().click();

  const recordedBody = (await finalMatchRequest).postDataJSON() as { currentRound: number };
  expect(recordedBody.currentRound).toBe(2);
});
