import { ONBOARDING_KEY } from '@/consts/onboarding';

import { BASE_URL } from '@e2e/consts';
import { expect, test } from '@e2e/fixtures/mockApiFixture';

/**
 * 게스트 진입점 제거 검증이라 토큰은 비운다
 * NOTE: 온보딩 열람 기록까지 비우면 온보딩으로 이동해 로그인 버튼 확인과 경쟁함
 */
test.use({
  storageState: {
    cookies: [],
    origins: [{ origin: BASE_URL, localStorage: [{ name: ONBOARDING_KEY.INTRO, value: '1' }] }],
  },
});

test('로그인 화면에 비회원 진입점이 없다', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('button', { name: '카카오로 시작하기' })).toBeVisible();
  /** 숨김(invisible) 부활 회귀까지 잡도록 DOM 부재를 직접 검증 */
  await expect(
    page.getByRole('button', { name: '비회원으로 시작하기', includeHidden: true })
  ).toHaveCount(0);
});
