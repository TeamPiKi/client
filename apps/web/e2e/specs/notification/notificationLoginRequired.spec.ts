import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { useGuestToken } from '@e2e/helpers/guestToken';
import { MOCK_GUEST_ME } from '@e2e/mocks/me';

test('게스트가 알림에 들어가면 로그인 유도 화면이 뜬다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);
  await useGuestToken(page);

  await page.goto('/notification');

  await expect(
    page.getByRole('heading', { name: '알림을 확인하려면 로그인이 필요해요' })
  ).toBeVisible();

  await page.getByRole('button', { name: '로그인하기' }).click();
  await expect(page).toHaveURL(/\/login\?redirect=%2Fnotification/);
});
