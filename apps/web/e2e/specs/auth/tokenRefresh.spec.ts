import { WEBVIEW_UA_TOKEN } from '@piki/core';
import type { Page } from '@playwright/test';

import { ENDPOINTS } from '@/consts/api';

import { BASE_URL } from '@e2e/consts';
import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { EXPIRED_ACCESS_TOKEN_SUB, applyExpiredAccessToken } from '@e2e/helpers/expiredAccessToken';
import { readFakeJwtPayload } from '@e2e/helpers/fakeJwt';
import { setSsrStatus } from '@e2e/helpers/ssrStatus';
import { REFRESHED_BODY_TOKEN_SUB, REFRESHED_COOKIE_TOKEN_SUB } from '@e2e/mocks/auth';
import { MOCK_GUEST_ME, MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_TOURNAMENT_LIST } from '@e2e/mocks/tournament';

const REFRESH_ROUTE_KEY = `POST ${ENDPOINTS.AUTH_TOKEN_REFRESH}`;

const readTokenPayloads = async (page: Page) => {
  const cookies = await page.context().cookies();
  const findToken = (name: string) => cookies.find(cookie => cookie.name === name)?.value;

  return {
    access: readFakeJwtPayload(findToken('access_token')),
    refresh: readFakeJwtPayload(findToken('refresh_token')),
  };
};

test('access 만료·refresh 유효면 갱신 후 페이지가 열리고 Set-Cookie 토큰이 저장된다', async ({
  page,
  api,
}) => {
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  await applyExpiredAccessToken(page);

  await page.goto('/home');

  await expect(page.getByRole('heading', { name: '최근 토너먼트' })).toBeVisible();

  const { access, refresh } = await readTokenPayloads(page);
  expect(access?.sub).toBe(REFRESHED_COOKIE_TOKEN_SUB);
  expect(refresh?.sub).toBe(REFRESHED_COOKIE_TOKEN_SUB);
  expect(access!.exp * 1000).toBeGreaterThan(Date.now());
});

test('게스트 토큰을 갱신하면 게스트 role 이 유지된다', async ({ page, api }) => {
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);
  await applyExpiredAccessToken(page, 'GUEST');

  await page.goto('/home');

  const { access, refresh } = await readTokenPayloads(page);
  expect(access?.sub).toBe(REFRESHED_COOKIE_TOKEN_SUB);
  expect(access?.role).toBe('GUEST');
  expect(refresh?.role).toBe('GUEST');
});

test.describe('앱(웹뷰) 환경', () => {
  test.use({ userAgent: `Mozilla/5.0 ${WEBVIEW_UA_TOKEN}/99.0.0` });

  test('갱신 응답 body 의 토큰을 쿠키로 저장한다', async ({ page, api }) => {
    api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
    api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
    await applyExpiredAccessToken(page);

    await page.goto('/home');

    await expect(page.getByRole('heading', { name: '최근 토너먼트' })).toBeVisible();

    const { access, refresh } = await readTokenPayloads(page);
    expect(access?.sub).toBe(REFRESHED_BODY_TOKEN_SUB);
    expect(refresh?.sub).toBe(REFRESHED_BODY_TOKEN_SUB);
  });
});

test('refresh 가 401 이면 원래 경로를 담아 로그인으로 보내고 토큰 쿠키를 폐기한다', async ({
  page,
}) => {
  await applyExpiredAccessToken(page);
  await setSsrStatus(page, REFRESH_ROUTE_KEY, 401);

  await page.goto('/archive/wish');

  await expect(page).toHaveURL(/\/login\?redirect=%2Farchive%2Fwish$/);
  await expect(page.getByRole('button', { name: '카카오로 시작하기' })).toBeVisible();

  const { access, refresh } = await readTokenPayloads(page);
  expect(access).toBeNull();
  expect(refresh).toBeNull();
});

test('refresh 가 500 이면 로그인으로 보내되 토큰 쿠키는 유지한다', async ({ page }) => {
  await applyExpiredAccessToken(page);
  await setSsrStatus(page, REFRESH_ROUTE_KEY, 500);

  await page.goto('/archive/wish');

  await expect(page).toHaveURL(/\/login\?redirect=%2Farchive%2Fwish$/);
  await expect(page.getByRole('button', { name: '카카오로 시작하기' })).toBeVisible();

  /** 5xx 는 토큰이 죽었다는 증거가 아니라 폐기하지 않는다 */
  const { access, refresh } = await readTokenPayloads(page);
  expect(access?.sub).toBe(EXPIRED_ACCESS_TOKEN_SUB);
  expect(refresh).not.toBeNull();
});

test('로그인 페이지에서 refresh 가 실패해도 리다이렉트 없이 로그인 화면이 열린다', async ({
  page,
}) => {
  await applyExpiredAccessToken(page);
  await setSsrStatus(page, REFRESH_ROUTE_KEY, 401);

  await page.goto('/login');

  await expect(page).toHaveURL(`${BASE_URL}/login`);
  await expect(page.getByRole('button', { name: '카카오로 시작하기' })).toBeVisible();

  const { access, refresh } = await readTokenPayloads(page);
  expect(access).toBeNull();
  expect(refresh).toBeNull();
});
