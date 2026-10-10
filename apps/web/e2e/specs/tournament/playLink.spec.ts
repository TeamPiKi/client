import { ERROR_CODE } from '@piki/core';

import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { readFakeJwtPayload } from '@e2e/helpers/fakeJwt';
import { ISSUED_GUEST_TOKEN_SUB } from '@e2e/mocks/auth';
import { MOCK_GUEST_ME, MOCK_MEMBER_ME } from '@e2e/mocks/me';
import {
  MOCK_TOURNAMENT_COMPLETED,
  MOCK_TOURNAMENT_IN_PROGRESS,
  MOCK_TOURNAMENT_PENDING,
} from '@e2e/mocks/tournament';

/** 공유 받은 원본 토너먼트 id — 응답으로 받은 복제 토너먼트 id 로 이동한다 */
const SOURCE_TOURNAMENT_ID = 9;
const PLAY_PATH = `/play/${SOURCE_TOURNAMENT_ID}`;

const DESTINATIONS = [
  { label: 'PENDING', tournament: MOCK_TOURNAMENT_PENDING, url: /\/tournament\/1\/create$/ },
  { label: 'IN_PROGRESS', tournament: MOCK_TOURNAMENT_IN_PROGRESS, url: /\/tournament\/2\/match$/ },
  { label: 'COMPLETED', tournament: MOCK_TOURNAMENT_COMPLETED, url: /\/tournament\/3\/result$/ },
];

for (const { label, tournament, url } of DESTINATIONS) {
  test(`복제된 토너먼트가 ${label} 이면 그 단계 화면으로 이동한다`, async ({ page, api }) => {
    api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
    api.post(ENDPOINTS.TOURNAMENT_FROM_PLAY_LINK(SOURCE_TOURNAMENT_ID), tournament.tournamentId);
    api.get(ENDPOINTS.TOURNAMENT(tournament.tournamentId), tournament);

    await page.goto(PLAY_PATH);

    await expect(page).toHaveURL(url, { timeout: 15_000 });
  });
}

test('플레이 링크가 만료·삭제되면 안내 화면과 홈 링크를 보여준다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.error('POST', ENDPOINTS.TOURNAMENT_FROM_PLAY_LINK(SOURCE_TOURNAMENT_ID), {
    status: 404,
    code: ERROR_CODE.TOURNAMENT_NOT_FOUND,
  });

  await page.goto(PLAY_PATH);

  await expect(page.getByRole('heading', { name: '플레이 링크가 유효하지 않아요' })).toBeVisible();
  await expect(page.getByRole('link', { name: '홈으로 가기' })).toHaveAttribute('href', '/home');
});

test.describe('무토큰', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('무토큰 진입은 미들웨어가 게스트를 발급한 뒤 복제 토너먼트로 이동한다', async ({
    page,
    api,
  }) => {
    api.get(ENDPOINTS.USER, MOCK_GUEST_ME);
    api.post(
      ENDPOINTS.TOURNAMENT_FROM_PLAY_LINK(SOURCE_TOURNAMENT_ID),
      MOCK_TOURNAMENT_PENDING.tournamentId
    );
    api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);

    await page.goto(PLAY_PATH);

    await expect(page).toHaveURL(/\/tournament\/1\/create$/, { timeout: 15_000 });

    const cookies = await page.context().cookies();
    const access = readFakeJwtPayload(
      cookies.find(cookie => cookie.name === 'access_token')?.value
    );
    expect(access?.sub).toBe(ISSUED_GUEST_TOKEN_SUB);
    expect(access?.role).toBe('GUEST');
  });
});
