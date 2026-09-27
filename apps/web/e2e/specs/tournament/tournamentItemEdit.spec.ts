import { ERROR_CODE, ERROR_MESSAGE_MAP } from '@piki/core';

import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { setSsrStatus } from '@e2e/helpers/ssrStatus';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import {
  MOCK_TOURNAMENT_ITEM_FRIEND,
  MOCK_TOURNAMENT_ITEM_READY,
  MOCK_TOURNAMENT_PENDING,
  MOCK_TOURNAMENT_PENDING_AS_PARTICIPANT,
} from '@e2e/mocks/tournament';

const OWNER_TOURNAMENT_ID = MOCK_TOURNAMENT_PENDING.tournamentId;
const PARTICIPANT_TOURNAMENT_ID = MOCK_TOURNAMENT_PENDING_AS_PARTICIPANT.tournamentId;

test('주최자는 아이템을 수정할 수 있고 저장하면 준비 화면으로 돌아간다', async ({ page, api }) => {
  const NEW_NAME = 'E2E 러닝화';
  const itemId = MOCK_TOURNAMENT_ITEM_READY.tournamentItemId;
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(OWNER_TOURNAMENT_ID), MOCK_TOURNAMENT_PENDING);
  api.get(ENDPOINTS.TOURNAMENT_ITEM(OWNER_TOURNAMENT_ID, itemId), MOCK_TOURNAMENT_ITEM_READY);

  await page.goto(`/tournament/${OWNER_TOURNAMENT_ID}/item/${itemId}`);

  await expect(page.getByText('위시 정보 확인')).toBeVisible();
  await page.getByRole('button', { name: '상품 정보 수정' }).click();
  await page.getByLabel('상품명').fill(NEW_NAME);

  api.patch(ENDPOINTS.TOURNAMENT_ITEM(OWNER_TOURNAMENT_ID, itemId), {
    ...MOCK_TOURNAMENT_ITEM_READY,
    name: NEW_NAME,
  });
  const patchRequest = page.waitForRequest(
    request =>
      request.method() === 'PATCH' &&
      request.url().includes(ENDPOINTS.TOURNAMENT_ITEM(OWNER_TOURNAMENT_ID, itemId))
  );
  await page.getByRole('button', { name: '저장하기' }).click();

  const patchBody = (await patchRequest).postDataBuffer()?.toString() ?? '';
  expect(patchBody).toContain('name="name"');
  expect(patchBody).toContain(NEW_NAME);
  await expect(page).toHaveURL(new RegExp(`/tournament/${OWNER_TOURNAMENT_ID}/create$`), {
    timeout: 15_000,
  });
});

test('참여자에게 친구 아이템은 조회 전용이다', async ({ page, api }) => {
  const itemId = MOCK_TOURNAMENT_ITEM_FRIEND.tournamentItemId;
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(PARTICIPANT_TOURNAMENT_ID), MOCK_TOURNAMENT_PENDING_AS_PARTICIPANT);
  api.get(
    ENDPOINTS.TOURNAMENT_ITEM(PARTICIPANT_TOURNAMENT_ID, itemId),
    MOCK_TOURNAMENT_ITEM_FRIEND
  );

  await page.goto(`/tournament/${PARTICIPANT_TOURNAMENT_ID}/item/${itemId}`);

  await expect(page.getByRole('heading', { name: MOCK_TOURNAMENT_ITEM_FRIEND.name })).toBeVisible();
  await expect(page.getByRole('button', { name: '상품 정보 수정' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '삭제하기' })).toHaveCount(0);
});

test('삭제된 아이템은 준비 화면으로 보내고 안내 토스트를 띄운다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(OWNER_TOURNAMENT_ID), MOCK_TOURNAMENT_PENDING);
  await setSsrStatus(
    page,
    `GET ${ENDPOINTS.TOURNAMENT_ITEM(OWNER_TOURNAMENT_ID, 99)}`,
    404,
    ERROR_CODE.TOURNAMENT_NOT_FOUND_ITEM
  );

  await page.goto(`/tournament/${OWNER_TOURNAMENT_ID}/item/99`);

  await expect(page).toHaveURL(new RegExp(`/tournament/${OWNER_TOURNAMENT_ID}/create`));
  await expect(
    page.getByText(ERROR_MESSAGE_MAP[ERROR_CODE.TOURNAMENT_NOT_FOUND_ITEM])
  ).toBeVisible();
});
