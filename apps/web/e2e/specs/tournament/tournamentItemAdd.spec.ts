import { ENDPOINTS } from '@/consts/api';

import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_FOLDER, MOCK_FOLDERS } from '@e2e/mocks/folder';
import { MOCK_MEMBER_ME } from '@e2e/mocks/me';
import {
  MOCK_TOURNAMENT_ITEMS,
  MOCK_TOURNAMENT_LIST,
  MOCK_TOURNAMENT_PENDING,
  MOCK_TOURNAMENT_PENDING_1ITEM,
  MOCK_TOURNAMENT_PENDING_3ITEMS,
  MOCK_TOURNAMENT_PENDING_4ITEMS,
  MOCK_TOURNAMENT_PENDING_WITH_ITEMS,
} from '@e2e/mocks/tournament';
import { MOCK_WISHLIST_ENTRIES } from '@e2e/mocks/wish';

/**
 * 솔로 토너먼트 1단계 — 생성 · 아이템 담기(by-wish) · 시작 가드.
 * 초대/공유를 누르지 않는 솔로 경로만 다룬다.
 * (매치 진행은 tournamentMatch.spec, 결과는 tournamentResult.spec — SSR 목이
 * 경로당 고정 응답이라 상태 전이를 한 id 로 표현할 수 없어 단계·id 를 분리했다)
 */
test('홈에서 새 토너먼트를 생성하면 담기 화면으로 이동한다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST);
  api.post(ENDPOINTS.TOURNAMENTS, { tournamentId: 1 });
  api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);

  await page.goto('/home');
  await page.getByRole('button', { name: '새 토너먼트 만들기' }).click();

  const createButton = page.getByRole('button', { name: '생성하기' });
  await expect(createButton).toBeDisabled();

  await page.getByLabel('토너먼트 이름').fill('E2E 토너먼트');

  const createRequest = page.waitForRequest(
    request => request.method() === 'POST' && request.url().includes(ENDPOINTS.TOURNAMENTS)
  );
  await createButton.click();
  expect((await createRequest).postDataJSON()).toMatchObject({ name: 'E2E 토너먼트' });

  await expect(page).toHaveURL('/tournament/1/create');
  await expect(page.getByText('후보를 장바구니에 담아보세요')).toBeVisible();
});

test('위시에서 상품 4개를 가져오면 장바구니에 담긴다', async ({ page, api }) => {
  /** "위시에서 가져오기" 는 회원 전용 — 멤버 유저로 목킹 */
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);
  api.post(ENDPOINTS.TOURNAMENT_ITEMS_FROM_WISH(1), {
    tournamentItemIds: MOCK_TOURNAMENT_ITEMS.map(item => item.tournamentItemId),
  });

  await page.goto('/tournament/1/create');
  await page.getByRole('button', { name: '위시 아이템 추가' }).click();
  await page.getByRole('link', { name: /위시에서 가져오기/ }).click();

  /** 로컬 dev 서버의 by-wish 라우트 첫 컴파일이 기본 5초를 넘길 수 있어 여유를 둔다 */
  await expect(page).toHaveURL('/tournament/1/create/by-wish', { timeout: 15_000 });
  await expect(page.getByRole('heading', { name: '내 위시에서 가져오기' })).toBeVisible();

  const nextButton = page.getByRole('button', { name: '다음' });
  await expect(nextButton).toBeDisabled();

  for (const { item } of MOCK_WISHLIST_ENTRIES) {
    await page.getByRole('button', { name: item.name ?? '' }).click();
  }

  /** 담기 성공 후 재조회부터는 4개 담긴 응답 (뒤에 등록한 목이 우선 매칭) */
  api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING_WITH_ITEMS);

  const wishRequest = page.waitForRequest(
    request =>
      request.method() === 'POST' && request.url().includes(ENDPOINTS.TOURNAMENT_ITEMS_FROM_WISH(1))
  );
  await nextButton.click();
  const wishBody = (await wishRequest).postDataJSON() as { itemIds: number[] };
  expect([...wishBody.itemIds].sort()).toEqual(
    MOCK_WISHLIST_ENTRIES.map(({ item }) => item.id).sort()
  );

  await expect(page).toHaveURL(/\/tournament\/1\/create/);
  await expect(page.getByText('4/32')).toBeVisible();
  await expect(page.getByAltText('토너먼트 아이템 4')).toBeVisible();
});

test('폴더 칩을 오가며 고른 위시를 함께 후보로 담는다', async ({ page, api }) => {
  const [FIRST_ENTRY, SECOND_ENTRY] = MOCK_WISHLIST_ENTRIES;

  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(1), MOCK_TOURNAMENT_PENDING);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);
  api.post(ENDPOINTS.TOURNAMENT_ITEMS_FROM_WISH(1), { tournamentItemIds: [11, 12] });

  await page.goto('/tournament/1/create/by-wish');
  await page.getByRole('button', { name: FIRST_ENTRY?.item.name ?? '' }).click();

  const folderRequest = page.waitForRequest(
    request =>
      request.url().includes(ENDPOINTS.WISHLISTS) &&
      new URL(request.url()).searchParams.get('folderId') === String(MOCK_FOLDER.id)
  );
  await page
    .getByRole('group', { name: '폴더 필터' })
    .getByRole('button', { name: MOCK_FOLDER.name })
    .click();
  await folderRequest;
  await page.getByRole('button', { name: SECOND_ENTRY?.item.name ?? '' }).click();
  await expect(page.getByText('2/32개 선택')).toBeVisible();

  const addRequest = page.waitForRequest(
    request =>
      request.method() === 'POST' && request.url().includes(ENDPOINTS.TOURNAMENT_ITEMS_FROM_WISH(1))
  );
  await page.getByRole('button', { name: '다음' }).click();

  const { itemIds } = (await addRequest).postDataJSON() as { itemIds: number[] };
  expect([...itemIds].sort()).toEqual([FIRST_ENTRY?.item.id, SECOND_ENTRY?.item.id].sort());
});

test('이미 후보에 담긴 상품은 위시 목록에서 빠진다', async ({ page, api }) => {
  const [ALREADY_ADDED, ...REST] = MOCK_WISHLIST_ENTRIES;

  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.getPage(ENDPOINTS.WISHLISTS, MOCK_WISHLIST_ENTRIES);
  api.get(ENDPOINTS.FOLDERS, MOCK_FOLDERS);

  await page.goto('/tournament/11/create/by-wish');

  await expect(page.getByText('0/31개 선택')).toBeVisible();
  await expect(page.getByText(ALREADY_ADDED?.item.name ?? '', { exact: true })).toHaveCount(0);
  for (const { item } of REST) {
    await expect(page.getByText(item.name ?? '', { exact: true })).toBeVisible();
  }
});

/**
 * 아래 가드 테스트들은 담긴 개수별로 토너먼트 id 를 분리해 SSR 목을 태운다 (11/13/14) —
 * 클라이언트가 staleTime 동안 레이아웃의 SSR 시드를 그대로 쓰기 때문에
 * 브라우저 목만으로는 담긴 개수를 바꿀 수 없다.
 */
test('후보가 2개 미만이면 시작 버튼이 비활성화된다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(11), MOCK_TOURNAMENT_PENDING_1ITEM);

  await page.goto('/tournament/11/create');

  await expect(page.getByText('최소 2개 이상 담아주세요')).toBeVisible();
  await expect(page.getByRole('button', { name: '토너먼트 시작하기' })).toBeDisabled();
});

test('후보 수가 2의 거듭제곱이 아니면 부전승 안내 모달이 뜬다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(13), MOCK_TOURNAMENT_PENDING_3ITEMS);

  await page.goto('/tournament/13/create');
  await page.getByRole('button', { name: '토너먼트 시작하기' }).click();

  await expect(page.getByText('부전승이 포함돼요')).toBeVisible();

  /** "상품 더 담기" 는 모달만 닫고 담기 화면에 남는다 */
  await page.getByRole('button', { name: '상품 더 담기' }).click();
  await expect(page.getByText('부전승이 포함돼요')).toBeHidden();
  await expect(page).toHaveURL('/tournament/13/create');
});

test('후보 4개로 시작하면 로딩 페이지로 이동한다', async ({ page, api }) => {
  api.get(ENDPOINTS.USER, MOCK_MEMBER_ME);
  api.get(ENDPOINTS.TOURNAMENT(14), MOCK_TOURNAMENT_PENDING_4ITEMS);
  api.post(ENDPOINTS.TOURNAMENT_START(14), {
    tournamentId: 14,
    items: MOCK_TOURNAMENT_ITEMS,
  });

  await page.goto('/tournament/14/create');
  await page.getByRole('button', { name: '토너먼트 시작하기' }).click();

  /** 로컬 dev 서버의 /loading 라우트 첫 컴파일이 기본 5초를 넘길 수 있어 여유를 둔다 */
  await expect(page).toHaveURL('/tournament/14/loading', { timeout: 15_000 });
});
