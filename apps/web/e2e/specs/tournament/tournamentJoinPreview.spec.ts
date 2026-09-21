import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';

const JOIN_PATH = '/tournament/join/1?code=E2ECODE';
const LOGIN_HREF = `/login?redirect=${encodeURIComponent(JOIN_PATH)}`;

const LOGIN_LINK_NAMES = ['가입하고 토너먼트 주최하기', '이미 회원이세요? 로그인하기'];

test.describe('무토큰', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('초대 프리뷰에 약관 고지와 로그인 유도가 노출된다', async ({ page }) => {
    await page.goto(JOIN_PATH);

    await expect(page.getByText('초대받은 토너먼트')).toBeVisible();
    await expect(page.getByText('E2E 토너먼트')).toBeVisible();

    await expect(page.getByRole('link', { name: '이용약관' })).toHaveAttribute('href', '/terms');
    await expect(page.getByRole('link', { name: '개인정보 처리방침' })).toHaveAttribute(
      'href',
      '/privacy'
    );

    for (const name of LOGIN_LINK_NAMES) {
      await expect(page.getByRole('link', { name })).toHaveAttribute('href', LOGIN_HREF);
    }
  });
});

test('회원은 닉네임이 채워지고 약관 고지·로그인 유도가 없다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);

  await page.goto(JOIN_PATH);

  await expect(page.getByRole('textbox')).toHaveValue(MOCK_MEMBER_ME.nickname);
  /** 숨김(invisible) 회귀까지 잡도록 DOM 부재를 직접 검증 */
  await expect(page.getByRole('link', { name: '이용약관', includeHidden: true })).toHaveCount(0);
  for (const name of LOGIN_LINK_NAMES) {
    await expect(page.getByRole('link', { name, includeHidden: true })).toHaveCount(0);
  }
});
