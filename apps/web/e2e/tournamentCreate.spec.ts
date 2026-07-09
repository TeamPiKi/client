import { ENDPOINTS } from '@/consts/api';

import { expect, test } from './fixtures/mockApiFixture';
import { MOCK_GUEST_ME } from './mocks/me';
import { MOCK_TOURNAMENT_LIST, MOCK_TOURNAMENT_PENDING } from './mocks/tournament';

/**
 * 홈 → 카드 클릭 → 준비 페이지 진입 플로우.
 * tournament/[id]/layout.tsx 의 서버사이드 접근 권한 조회(getTournament 직접 await)는
 * globalSetup 의 목 스텁 서버가, 브라우저 발 요청은 page.route 목이 응답한다.
 */
test('홈에서 토너먼트 카드를 누르면 준비 페이지로 이동하고 토너먼트 이름이 렌더링된다', async ({
  page,
  api,
}) => {
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  await page.goto('/home');

  /** AUTHORIZED 라우트 — 가짜 게스트 JWT(storageState)로 미들웨어 통과를 함께 검증한다 */
  await page.getByRole('link', { name: 'E2E 토너먼트' }).click();

  await expect(page).toHaveURL('/tournament/1/create');
  await expect(page.getByText('E2E 토너먼트')).toBeVisible();
});
