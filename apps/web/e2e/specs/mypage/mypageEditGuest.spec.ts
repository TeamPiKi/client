import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { useGuestToken } from '@e2e/helpers/guestToken';
import { MOCK_GUEST_ME } from '@e2e/mocks/me';

test('게스트가 프로필 수정에 들어가면 마이페이지로 리다이렉트된다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);
  await useGuestToken(page);

  await page.goto('/mypage/edit');

  await expect(page).toHaveURL(/\/mypage$/);
});
