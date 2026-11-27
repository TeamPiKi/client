import { ENDPOINTS } from '@/consts/api';
import { ROUTES } from '@/consts/route';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { setSsrEmpty } from '@e2e/helpers/ssrEmpty';
import { setSsrStatus } from '@e2e/helpers/ssrStatus';
import {
  MOCK_EXPLORE_PICK,
  MOCK_EXPLORE_PICKS,
  MOCK_EXPLORE_PICK_CANDIDATES,
} from '@e2e/mocks/explore';

const [MAIN_PICK, SAVED_PICK] = MOCK_EXPLORE_PICKS.picks;
const SECTION_TITLE = '남들은 뭘 골랐을까?';

test('탐색 피드의 1위 카드는 1위 상세로 이어진다', async ({ page }) => {
  await page.goto(ROUTES.EXPLORE);

  const card = page.getByRole('link').filter({ hasText: MAIN_PICK!.item.name });
  await expect(card).toHaveAttribute('href', ROUTES.EXPLORE_PICK(MAIN_PICK!.pickId));
});

test('1위가 없으면 남들은 뭘 골랐을까? 섹션만 숨긴다', async ({ page }) => {
  await setSsrEmpty(page, ENDPOINTS.EXPLORE_PICKS);

  await page.goto(ROUTES.EXPLORE);

  await expect(page.getByRole('heading', { name: '방금 담긴 위시' })).toBeVisible();
  await expect(page.getByRole('heading', { name: SECTION_TITLE })).toHaveCount(0);
});

test('전체보기는 토너먼트 이름을 보여주고 이미 담은 1위는 하트를 채운다', async ({ page }) => {
  await page.goto(ROUTES.EXPLORE_WINNERS);

  await expect(page.getByText(MAIN_PICK!.tournament.name)).toBeVisible();
  await expect(page.getByText(SAVED_PICK!.tournament.name)).toBeVisible();
  await expect(page.getByRole('button', { name: '내 위시에 담긴 상품' })).toHaveCount(1);
});

test('전체보기 하트를 누르면 1위 후보 담기를 요청하고 하트를 채운다', async ({ page, api }) => {
  const copyPath = ENDPOINTS.EXPLORE_PICK_CANDIDATE_COPY(MAIN_PICK!.pickId, MAIN_PICK!.candidateId);
  api.post(copyPath, { wishId: 9101, alreadySaved: false });
  await page.goto(ROUTES.EXPLORE_WINNERS);

  const copyRequest = page.waitForRequest(
    request => request.method() === 'POST' && new URL(request.url()).pathname === copyPath
  );
  await page.getByRole('button', { name: '내 위시로 담기' }).click();

  await copyRequest;
  await expect(page.getByText('내 위시에 상품을 담았어요')).toBeVisible();
  await expect(page.getByRole('button', { name: '내 위시에 담긴 상품' })).toHaveCount(2);
});

test('1위 상세는 고른 사람과 토너먼트 후보 카드를 보여준다', async ({ page }) => {
  await page.goto(ROUTES.EXPLORE_PICK(MOCK_EXPLORE_PICK.pickId));

  await expect(page.getByText(`${MOCK_EXPLORE_PICK.savedUserCount}명이 담은 상품`)).toBeVisible();
  await expect(
    page.getByRole('link', { name: `${MOCK_EXPLORE_PICK.picker.nickname} 프로필` })
  ).toBeVisible();
  await expect(
    page.getByText(`후보 ${MOCK_EXPLORE_PICK.tournament.candidateCount}개 중 최종 선택`)
  ).toBeVisible();
  await expect(
    page.getByRole('link').filter({ hasText: MOCK_EXPLORE_PICK.tournament.name })
  ).toHaveAttribute('href', ROUTES.EXPLORE_WINNER_CANDIDATES(MOCK_EXPLORE_PICK.pickId));
});

test('1위 상세에서 내 위시로 담기를 누르면 1위 후보 담기를 요청한다', async ({ page, api }) => {
  const copyPath = ENDPOINTS.EXPLORE_PICK_CANDIDATE_COPY(
    MOCK_EXPLORE_PICK.pickId,
    MOCK_EXPLORE_PICK.candidateId
  );
  api.post(copyPath, { wishId: 9102, alreadySaved: true });
  await page.goto(ROUTES.EXPLORE_PICK(MOCK_EXPLORE_PICK.pickId));

  const copyRequest = page.waitForRequest(
    request => request.method() === 'POST' && new URL(request.url()).pathname === copyPath
  );
  await page.getByRole('button', { name: '내 위시로 담기' }).click();

  await copyRequest;
  await expect(page.getByText('이미 내 위시에 있는 상품이에요')).toBeVisible();
  await expect(page.getByRole('button', { name: '내 위시로 담기' })).toBeDisabled();
});

test('볼 수 없는 1위면 서버 404 를 찾을 수 없는 화면으로 보여준다', async ({ page }) => {
  await setSsrStatus(
    page,
    `GET ${ENDPOINTS.EXPLORE_PICK(MOCK_EXPLORE_PICK.pickId)}`,
    404,
    'EXPLORE-001'
  );

  await page.goto(ROUTES.EXPLORE_PICK(MOCK_EXPLORE_PICK.pickId));

  await expect(page.getByText('페이지를 찾을 수 없어요')).toBeVisible();
});

test('후보 목록은 토너먼트 이름을 제목으로 1위부터 보여준다', async ({ page }) => {
  await page.goto(ROUTES.EXPLORE_WINNER_CANDIDATES(MOCK_EXPLORE_PICK_CANDIDATES.pickId));

  await expect(
    page.getByRole('heading', { name: MOCK_EXPLORE_PICK_CANDIDATES.tournament.name })
  ).toBeVisible();
  const items = page.getByRole('listitem');
  await expect(items).toHaveCount(MOCK_EXPLORE_PICK_CANDIDATES.candidates.length);
  await expect(items.first()).toContainText('1위');
  await expect(items.first()).toContainText(MAIN_PICK!.item.name);
  await expect(page.getByRole('button', { name: '내 위시에 담긴 상품' })).toHaveCount(1);
});
