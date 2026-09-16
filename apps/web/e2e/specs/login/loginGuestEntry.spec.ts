import { expect, test } from '@e2e/fixtures/mockApiFixture';

/** 게스트 진입점 제거 검증이라 기본 storageState(토큰)를 비운다 */
test.use({ storageState: { cookies: [], origins: [] } });

test('로그인 화면에 비회원 진입점이 없다', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('button', { name: '카카오로 시작하기' })).toBeVisible();
  /** 숨김(invisible) 부활 회귀까지 잡도록 DOM 부재를 직접 검증 */
  await expect(
    page.getByRole('button', { name: '비회원으로 시작하기', includeHidden: true })
  ).toHaveCount(0);
});
