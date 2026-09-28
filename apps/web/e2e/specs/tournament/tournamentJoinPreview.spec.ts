import { ERROR_CODE } from '@piki/core';

import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { createFakeJwt, readFakeJwtPayload } from '@e2e/helpers/fakeJwt';
import { setSsrStatus } from '@e2e/helpers/ssrStatus';
import { MOCK_GUEST_ME, MOCK_MEMBER_ME } from '@e2e/mocks/me';
import { MOCK_TOURNAMENT_PENDING } from '@e2e/mocks/tournament';

const INVITE_CODE = 'E2ECODE';
const JOIN_PATH = `/tournament/join/1?code=${INVITE_CODE}`;
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

  test('토큰 없이 참여하면 게스트 토큰이 발급되고 준비 화면으로 이동한다', async ({
    page,
    api,
  }) => {
    const NICKNAME = '피키손님';
    api.get(ENDPOINTS.USER, MOCK_GUEST_ME);
    api.get(ENDPOINTS.USER_NICKNAME_CHECK, { available: true });
    api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);
    /** 실서버는 join/guest 응답의 Set-Cookie 로 게스트 토큰을 심는다 — 스텁도 같은 헤더를 낸다 */
    const guestToken = createFakeJwt(60 * 60, 'GUEST');
    await page.route(`**${ENDPOINTS.TOURNAMENT_JOIN_GUEST(1)}`, route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'set-cookie': [
            `access_token=${guestToken}; Path=/`,
            `refresh_token=${guestToken}; Path=/`,
          ].join('\n'),
        },
        body: JSON.stringify({
          data: {
            ...MOCK_GUEST_ME,
            userId: MOCK_GUEST_ME.id,
            tournamentId: 1,
            accessToken: null,
            refreshToken: null,
          },
          code: null,
        }),
      })
    );

    await page.goto(JOIN_PATH);
    await page.getByRole('textbox').fill(NICKNAME);

    const joinRequest = page.waitForRequest(
      request =>
        request.method() === 'POST' && request.url().includes(ENDPOINTS.TOURNAMENT_JOIN_GUEST(1))
    );
    await page.getByRole('button', { name: '참여하기' }).click();

    expect((await joinRequest).postDataJSON()).toEqual({
      inviteCode: INVITE_CODE,
      nickname: NICKNAME,
    });
    await expect(page).toHaveURL(/\/tournament\/1\/create/, { timeout: 15_000 });

    const cookies = await page.context().cookies();
    const access = readFakeJwtPayload(
      cookies.find(cookie => cookie.name === 'access_token')?.value
    );
    expect(access?.role).toBe('GUEST');
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

test('회원이 초대 링크에서 참여하기를 누르면 준비 화면으로 이동하고 참여 안내가 뜬다', async ({
  page,
  api,
}) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.post(ENDPOINTS.TOURNAMENT_JOIN(1), { tournamentId: 1 });
  api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);

  await page.goto(JOIN_PATH);

  const joinRequest = page.waitForRequest(
    request => request.method() === 'POST' && request.url().includes(ENDPOINTS.TOURNAMENT_JOIN(1))
  );
  await page.getByRole('button', { name: '참여하기' }).click();

  expect((await joinRequest).postDataJSON()).toEqual({ inviteCode: INVITE_CODE });
  await expect(page).toHaveURL(/\/tournament\/1\/create/, { timeout: 15_000 });
  await expect(page.getByText('이 이름으로 참여할게요.')).toBeVisible();
});

test('이미 참여한 회원은 참여 안내 없이 준비 화면으로 이동한다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.error('POST', ENDPOINTS.TOURNAMENT_JOIN(1), {
    status: 409,
    code: ERROR_CODE.TOURNAMENT_ALREADY_PARTICIPANT,
  });
  api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);

  await page.goto(JOIN_PATH);
  await page.getByRole('button', { name: '참여하기' }).click();

  await expect(page).toHaveURL(/\/tournament\/1\/create$/, { timeout: 15_000 });
});

test('시작된 토너먼트의 초대는 시작됨 안내를 보여준다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  await setSsrStatus(
    page,
    `GET ${ENDPOINTS.TOURNAMENT_INVITE_PREVIEW_BY_CODE}`,
    409,
    ERROR_CODE.TOURNAMENT_NOT_PENDING
  );

  await page.goto(JOIN_PATH);

  await expect(page.getByText('이미 시작된 토너먼트예요.')).toBeVisible();
});
