import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';

test('회원 마이페이지에 프로필과 계정 메뉴가 보이고 로그아웃하면 로그인으로 이동한다', async ({
  page,
  api,
}) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  /** 실서버는 로그아웃 응답의 Set-Cookie 로 httpOnly 토큰을 지운다 — 스텁도 같은 헤더를 낸다 */
  await page.route(`**${ENDPOINTS.AUTH_LOGOUT}`, route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'set-cookie': [
          'access_token=; Path=/; Max-Age=0',
          'refresh_token=; Path=/; Max-Age=0',
        ].join('\n'),
      },
      body: JSON.stringify({ data: { loggedOut: true }, code: null }),
    })
  );

  await page.goto('/mypage');

  await expect(page.getByRole('heading', { name: '마이' })).toBeVisible();
  await expect(page.getByText(MOCK_MEMBER_ME.nickname)).toBeVisible();
  await expect(page.getByText(MOCK_MEMBER_ME.email)).toBeVisible();
  await expect(page.getByRole('link', { name: '탈퇴하기' })).toBeVisible();
  await expect(page.getByText('로그인해주세요.')).toHaveCount(0);

  await page.getByRole('button', { name: '로그아웃' }).click();
  await expect(page.getByRole('dialog', { name: '로그아웃 하시겠어요?' })).toBeVisible();

  const logoutRequest = page.waitForRequest(
    request => request.method() === 'POST' && request.url().includes(ENDPOINTS.AUTH_LOGOUT)
  );
  await page.getByRole('dialog').getByRole('button', { name: '로그아웃' }).click();
  await logoutRequest;

  await expect(page).toHaveURL(/\/login$/, { timeout: 15_000 });
  await expect(page.getByRole('button', { name: '카카오로 시작하기' })).toBeVisible();

  const cookies = await page.context().cookies();
  expect(cookies.find(cookie => cookie.name === 'access_token')).toBeUndefined();
  expect(cookies.find(cookie => cookie.name === 'refresh_token')).toBeUndefined();
});
