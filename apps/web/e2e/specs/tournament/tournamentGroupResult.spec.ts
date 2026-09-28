import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { setSsrStatus } from '@e2e/helpers/ssrStatus';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_GROUP_RESULT, MOCK_TOURNAMENT_GROUP_COMPLETED } from '@e2e/mocks/tournament';

const TOURNAMENT_ID = MOCK_TOURNAMENT_GROUP_COMPLETED.tournamentId;
const GROUP_RESULT_PATH = `/tournament/${TOURNAMENT_ID}/result/group`;
const [FIRST_PLACE] = MOCK_GROUP_RESULT.items;

test('그룹 결과에 순위별 상품과 고른 친구가 렌더링되고 뒤로가기는 내 결과로 폴백한다', async ({
  page,
  api,
}) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(TOURNAMENT_ID), MOCK_TOURNAMENT_GROUP_COMPLETED);
  api.get(ENDPOINTS.TOURNAMENT_GROUP_RESULT(TOURNAMENT_ID), MOCK_GROUP_RESULT);

  await page.goto(GROUP_RESULT_PATH);

  await expect(page.getByRole('heading', { name: '친구 토너먼트 결과' })).toBeVisible();
  /** 영수증 기계가 측정용 복제본을 함께 그려 같은 텍스트가 둘 — 보이는 쪽은 마지막 */
  await expect(page.getByText(MOCK_TOURNAMENT_GROUP_COMPLETED.name).last()).toBeVisible();
  await expect(page.getByText(FIRST_PLACE!.name).last()).toBeVisible();

  await page
    .getByRole('button', { name: `${FIRST_PLACE!.chosenBy.length}명` })
    .last()
    .click();
  for (const chooser of FIRST_PLACE!.chosenBy) {
    await expect(page.getByText(chooser.nickname).last()).toBeVisible();
  }

  /** 직접 진입은 히스토리 깊이 0 이라 back 대신 내 결과로 replace 된다 */
  await page.getByRole('button', { name: '뒤로가기' }).click();
  await expect(page).toHaveURL(new RegExp(`/tournament/${TOURNAMENT_ID}/result$`));
});

test('그룹 결과를 조회할 수 없으면 아직 결과가 없다는 안내를 보여준다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(TOURNAMENT_ID), MOCK_TOURNAMENT_GROUP_COMPLETED);
  api.error('GET', ENDPOINTS.TOURNAMENT_GROUP_RESULT(TOURNAMENT_ID), { status: 409 });
  /** RSC 가 prefetch 한 결과가 그대로 하이드레이션되므로 SSR 스텁도 함께 실패시킨다 */
  await setSsrStatus(page, `GET ${ENDPOINTS.TOURNAMENT_GROUP_RESULT(TOURNAMENT_ID)}`, 409);

  await page.goto(GROUP_RESULT_PATH);

  await expect(page.getByText('아직 친구 결과가 없어요')).toBeVisible();
});
