# E2E 테스트 가이드

Playwright로 "실제 브라우저에서 사용자처럼 클릭해보는" 테스트를 돌립니다.

## 실행 방법

```bash
pnpm test:e2e                          # 전체 실행 — 터미널에 ✓/✗ 로 결과 출력
pnpm --filter piki-web test:e2e:ui     # GUI 모드 — 화면을 눈으로 보며 실행/디버깅
```

- 첫 실행은 dev 서버 컴파일 때문에 몇 분 걸릴 수 있습니다 (2회차부터 수 초)
- UI 모드에서 테스트가 안 보이면: 좌측 필터의 **Projects에서 `mobile-chromium` 체크** (기본은 setup만 체크됨)
- 실서버에는 전혀 접속하지 않습니다 — 모든 API는 목(가짜 응답)으로 처리되고, 인증도 가짜 게스트 토큰으로 자동 처리됩니다. **로그인·데이터 준비 없이 그냥 돌리면 됩니다**

## 폴더 구조

```
e2e/
├── specs/                      # 테스트는 전부 여기에
│   ├── home/                   # app/ 의 top-level 라우트와 같은 이름으로 폴더 구분
│   │   └── home.spec.ts
│   └── tournament/
│       └── tournamentCreate.spec.ts
├── mocks/                      # 목 데이터 상수 (도메인별 파일)
├── fixtures/mockApiFixture.ts  # API 목킹 fixture — 테스트는 여기서 test/expect import
├── helpers/                    # 응답 규약 래핑, 가짜 JWT
└── setup/                      # 인증 상태 생성, SSR 목 스텁 서버 (건드릴 일 거의 없음)
```

- **새 테스트 위치**: 검증하려는 페이지의 라우트 폴더 → `specs/<라우트>/<이름>.spec.ts`
  - 예: 보관함 테스트 → `specs/archive/archiveList.spec.ts` (폴더 없으면 생성)
  - 홈에서 출발해 토너먼트 페이지를 검증하면? → **검증 대상** 기준으로 `tournament/`

## 1. 새 테스트 추가하기

`specs/<라우트>/` 에 `.spec.ts` 파일을 만들고 이 템플릿에서 시작하세요:

```ts
import { ENDPOINTS } from '@/consts/api';

// ⚠️ test/expect 는 @playwright/test 가 아니라 fixture 에서 import!
import { expect, test } from '@e2e/fixtures/mockApiFixture';
import { MOCK_GUEST_ME } from '@e2e/mocks/me';

test('홈에 진입하면 진행 중인 토너먼트 목록이 렌더링된다', async ({ page, api }) => {
  // 1️⃣ 이 페이지가 호출하는 API의 목 등록 (반드시 goto 전에)
  api.get(ENDPOINTS.USER, MOCK_GUEST_ME);

  // 2️⃣ 페이지 진입
  await page.goto('/home');

  // 3️⃣ 화면 검증
  await expect(page.getByRole('heading', { name: '진행 중인 토너먼트' })).toBeVisible();
});
```

### 꼭 알아야 할 Playwright 기초

1. **`page`** = 브라우저 탭. `page.goto('/home')` 으로 이동, `page.getByText('담기').click()` 으로 클릭
2. **locator** = 요소 찾기. 우선순위: `getByRole('button', { name: '시작' })` > `getByText('E2E 토너먼트')` > CSS 선택자(지양)
3. **`expect` + auto-waiting** = `await expect(locator).toBeVisible()` 은 요소가 나타날 때까지 **알아서 기다렸다가** 판정합니다. `waitForTimeout` 같은 수동 대기는 쓰지 마세요

거의 모든 줄에 `await`가 붙습니다. locator를 못 찾겠으면 UI 모드의 **Pick locator**(스냅샷 하단 커서 아이콘)로 화면을 클릭하면 코드를 만들어줍니다.

### api 사용법

```ts
api.get(ENDPOINTS.TOURNAMENTS, MOCK_TOURNAMENT_LIST); // GET 성공 응답
api.post(ENDPOINTS.AUTH_GUEST, mockData); // POST 성공 응답
api.error('GET', ENDPOINTS.TOURNAMENT(1), { status: 500 }); // 에러 응답 (에러 화면 테스트용)
```

경로는 항상 `@/consts/api` 의 `ENDPOINTS` 상수를 쓰세요. 응답은 팀 규약 `{ status, data, code }` 로 자동 래핑되므로 **data 안에 들어갈 내용만** 넘기면 됩니다.

## 2. 목 데이터 작성하기

`mocks/` 에 도메인별 파일로 두고, **실제 응답 타입을 import해서 그 타입으로 선언**하세요. (필드가 빠지거나 이름이 틀리면 타입 에러로 바로 잡힙니다)

```ts
// mocks/tournament.ts
import type { TournamentT } from '@/types/tournament';

export const MOCK_TOURNAMENT_LIST: TournamentT[] = [
  {
    tournamentId: 1,
    name: 'E2E 토너먼트',
    status: 'PENDING',
    createdAt: '2026-01-01T00:00:00Z',
    participantProfileImages: [MOCK_IMAGE_URLS.avatar], // ⚠️ 이미지는 아래 규칙 참고
  },
];
```

규칙:

- **이미지는 `mocks/images.ts` 의 `MOCK_IMAGE_URLS` 사용** — 임의의 실제 외부 URL 을 넣으면 안 됩니다. 가짜 CDN 주소이고, fixture 가 `/_next/image` 요청을 가로채 로컬 이미지(AVATAR/PRODUCT 라벨 SVG)로 응답하므로 외부 접속이 발생하지 않습니다. 새 용도가 필요하면 `MOCK_IMAGE_URLS` 와 `MOCK_IMAGE_MAP` 에 한 쌍 추가하세요
- **날짜는 고정값** 사용. 단, 만료 검사를 통과해야 하는 필드(`inviteExpiresAt` 등)만 `new Date(Date.now() + ...)` 로 미래 시각 생성
- 값은 시나리오가 요구하는 상태로 (예: 준비 화면 테스트면 `status: 'PENDING'`)

### 서버(SSR)에서도 호출되는 API라면

목을 등록했는데도 페이지가 "오류가 발생했어요" 화면이면, 그 API를 **서버 컴포넌트가 직접 호출**하는 경우입니다(예: `tournament/[id]` 레이아웃의 접근 권한 조회). 이때는 `setup/mockApiServer.ts` 의 `SSR_MOCK_ROUTES` 에도 같은 목 상수를 한 줄 추가하세요:

```ts
[`GET ${ENDPOINTS.TOURNAMENT(1)}`]: createApiSuccess(MOCK_TOURNAMENT_PENDING),
```

## 목킹 구조

요청 경로별로 3겹입니다. 테스트 작성 시엔 몰라도 되지만, 구조가 궁금할 때:

| 요청 경로                     | 처리                                         | 위치                         |
| ----------------------------- | -------------------------------------------- | ---------------------------- |
| 인증 (미들웨어 게스트 로그인) | 가짜 JWT 쿠키로 우회 (미들웨어는 exp만 검사) | `setup/auth.setup.ts`        |
| 브라우저 발 API               | `page.route()` 인터셉트                      | `fixtures/mockApiFixture.ts` |
| 서버(SSR) 발 API              | 로컬 목 스텁 서버 `127.0.0.1:4010`           | `setup/mockApiServer.ts`     |

CI에서는 프로덕션 빌드(`next build` + `next start`) 기준으로 같은 테스트가 돌며, PR의 `e2e` 체크로 표시됩니다(현재 required 아님).
