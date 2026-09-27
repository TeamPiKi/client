import { ERROR_CODE, ERROR_MESSAGE_MAP } from '@piki/core';

import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { applyGuestToken } from '@e2e/helpers/guestToken';
import { MOCK_GUEST_ME, MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_TOURNAMENT_LIST } from '@e2e/mocks/tournament';

test('회원이 redirect 를 담아 로그인에 들어오면 그 경로로 보낸다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);

  await page.goto('/login?redirect=%2Fmypage');

  /** #708 회귀 방지 — redirect 파라미터가 홈으로 유실되지 않아야 한다 */
  await expect(page).toHaveURL(/\/mypage$/);
  await expect(page.getByRole('heading', { name: '마이' })).toBeVisible();
});

test('회원이 redirect 없이 로그인에 들어오면 홈으로 보낸다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);

  await page.goto('/login');

  await expect(page).toHaveURL(/\/home$/);
});

test('세션 만료로 들어온 회원은 홈으로 보내지 않고 토큰을 폐기한 채 로그인 화면을 연다', async ({
  page,
}) => {
  await page.goto('/login?action=session-expired');

  await expect(page.getByText(ERROR_MESSAGE_MAP[ERROR_CODE.AUTH_INVALID_TOKEN])).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: '카카오로 시작하기' })).toBeVisible();

  const cookies = await page.context().cookies();
  expect(cookies.find(cookie => cookie.name === 'access_token')).toBeUndefined();
  expect(cookies.find(cookie => cookie.name === 'refresh_token')).toBeUndefined();
});

test('게스트는 로그인 화면에 머무른다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);
  await applyGuestToken(page);

  await page.goto('/login');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: '카카오로 시작하기' })).toBeVisible();
});
