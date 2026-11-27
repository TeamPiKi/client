import { ERROR_CODE } from '@piki/core';
import type { Page } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import { BASE_URL } from '@e2e/consts';
import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';

const USER_ID = '11111111-1111-4111-8111-111111111111';

const waitReportRequest = (page: Page) =>
  page.waitForRequest(
    request => request.method() === 'POST' && request.url().endsWith(ENDPOINTS.USER_REPORT(USER_ID))
  );

test('사유를 골라 신고하면 서버 사유 값으로 요청하고 프로필로 돌아간다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.USER_REPORT(USER_ID), null);

  await page.goto(`/report/${USER_ID}`);
  await page.getByText('스팸·광고성 콘텐츠').click();

  const reportRequest = waitReportRequest(page);
  await page.getByRole('button', { name: '신고하기' }).click();

  expect((await reportRequest).postDataJSON()).toEqual({ reason: 'SPAM_OR_AD' });
  await expect(page.getByText('신고가 접수됐어요')).toBeVisible();
  await expect(page).toHaveURL(`${BASE_URL}/profile/${USER_ID}`);
});

test('기타에 내용을 쓰면 상세 내용을 함께 보낸다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.USER_REPORT(USER_ID), null);

  await page.goto(`/report/${USER_ID}`);
  await page.getByText('기타', { exact: true }).click();
  await page
    .getByRole('textbox', { name: '기타 신고 사유' })
    .fill('개인 계좌로 결제를 유도했어요.');

  const reportRequest = waitReportRequest(page);
  await page.getByRole('button', { name: '신고하기' }).click();

  expect((await reportRequest).postDataJSON()).toEqual({
    reason: 'OTHER',
    detail: '개인 계좌로 결제를 유도했어요.',
  });
});

test('기타만 고르고 내용을 비우면 상세 내용 없이 신고한다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.USER_REPORT(USER_ID), null);

  await page.goto(`/report/${USER_ID}`);
  await page.getByText('기타', { exact: true }).click();

  const reportRequest = waitReportRequest(page);
  await page.getByRole('button', { name: '신고하기' }).click();

  expect((await reportRequest).postDataJSON()).toEqual({ reason: 'OTHER' });
});

test('기타 내용을 쓰다 다른 사유로 바꾸면 상세 내용을 보내지 않는다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.USER_REPORT(USER_ID), null);

  await page.goto(`/report/${USER_ID}`);
  await page.getByText('기타', { exact: true }).click();
  await page.getByRole('textbox', { name: '기타 신고 사유' }).fill('지울 내용');
  await page.getByText('다른 사람 사칭').click();
  await expect(page.getByRole('textbox', { name: '기타 신고 사유' })).toHaveCount(0);

  const reportRequest = waitReportRequest(page);
  await page.getByRole('button', { name: '신고하기' }).click();

  expect((await reportRequest).postDataJSON()).toEqual({ reason: 'IMPERSONATION' });
});

test('신고할 상대가 없으면 안내 토스트를 띄우고 신고 화면을 벗어난다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.error('POST', ENDPOINTS.USER_REPORT(USER_ID), {
    status: 404,
    code: ERROR_CODE.USER_NOT_FOUND,
  });

  await page.goto(`/report/${USER_ID}`);
  await page.getByText('욕설·혐오 표현').click();
  await page.getByRole('button', { name: '신고하기' }).click();

  await expect(page.getByText('존재하지 않는 계정이에요.')).toBeVisible();
  await expect(page).toHaveURL(`${BASE_URL}/home`);
});

test('기타 내용은 300자까지만 입력된다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.USER_REPORT(USER_ID), null);

  await page.goto(`/report/${USER_ID}`);
  await page.getByText('기타', { exact: true }).click();
  const field = page.getByRole('textbox', { name: '기타 신고 사유' });
  await field.fill('가'.repeat(301));

  await expect(field).toHaveValue('가'.repeat(300));
  await expect(page.getByText('300/300')).toBeVisible();

  const reportRequest = waitReportRequest(page);
  await page.getByRole('button', { name: '신고하기' }).click();

  expect((await reportRequest).postDataJSON()).toEqual({
    reason: 'OTHER',
    detail: '가'.repeat(300),
  });
});
