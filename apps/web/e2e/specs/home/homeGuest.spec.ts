import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { applyGuestToken } from '@e2e/helpers/guestToken';
import { MOCK_GUEST_ME } from '@e2e/mocks/me';
import { MOCK_TOURNAMENT_LIST } from '@e2e/mocks/tournament';

test('게스트 홈은 토너먼트를 보유해도 리스트 대신 로그인 유도가 뜬다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);
  /** 보유 여부와 무관함을 검증 — 리스트 목이 있어도 게스트는 조회 자체를 하지 않는다 */
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  await applyGuestToken(page);

  await page.goto('/home');

  await expect(page.getByText('아직 로그인 전이세요?')).toBeVisible();
  await expect(page.getByRole('heading', { name: '최근 토너먼트' })).toBeHidden();
  await expect(page.getByText('E2E 토너먼트')).toBeHidden();
});

test('게스트가 새 토너먼트 만들기를 누르면 로그인 유도 화면이 뜬다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);
  await applyGuestToken(page);

  await page.goto('/home');
  await page.getByRole('button', { name: '새 토너먼트 만들기' }).click();

  await expect(
    page.getByRole('heading', { name: '토너먼트를 만들려면 로그인이 필요해요' })
  ).toBeVisible();

  /** 오버레이가 탭바를 가리지 않는다 — z-index 회귀 방지 */
  await expect(page.getByRole('link', { name: '홈' })).toBeVisible();

  /** 홈으로 돌아가기는 오버레이만 닫는다 */
  await page.getByRole('button', { name: '홈으로 돌아가기' }).click();
  await expect(
    page.getByRole('heading', { name: '토너먼트를 만들려면 로그인이 필요해요' })
  ).toBeHidden();
});

test('게스트가 위시 담기를 누르면 로그인 유도 화면이 뜬다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);
  await applyGuestToken(page);

  await page.goto('/home');
  await page.getByRole('button', { name: '위시 담기' }).click();

  await expect(
    page.getByRole('heading', { name: '위시를 담으려면 로그인이 필요해요' })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: '홈' })).toBeVisible();
});

test.describe('무토큰', () => {
  /** 자동 게스트 발급 제거 검증이라 기본 storageState(토큰)를 비운다 */
  test.use({ storageState: { cookies: [], origins: [] } });

  test('무토큰으로 홈에 들어가면 게스트 발급 없이 로그인으로 리다이렉트된다', async ({ page }) => {
    await page.goto('/home');

    await expect(page).toHaveURL(/\/login\?redirect=%2Fhome/);

    /** 자동 발급이 일어나지 않아야 한다 — 게스트 토큰 쿠키 없음 */
    const cookies = await page.context().cookies();
    expect(cookies.find(cookie => cookie.name === 'access_token')).toBeUndefined();
    expect(cookies.find(cookie => cookie.name === 'refresh_token')).toBeUndefined();
  });
});
