# 페이지 전환 속도 개선 — RSC 블로킹 fetch 리팩토링

> 작성일: 2026-07-15 · **전수조사 반영: 2026-07-20**
> 대상: apps/web (Next.js 16 App Router + TanStack Query v5)

## TL;DR

- 페이지 전환이 느린 원인은 **매 전환마다 RSC(서버 컴포넌트)가 `await prefetchQuery(...)` 로 백엔드 응답을 다 기다린 후에야 화면을 내려주는 구조** 때문이다.
- 클라이언트에 fresh 한 TanStack Query 캐시(`staleTime: 60s`)가 있어도, **서버는 클라 캐시를 모르기 때문에** 전환할 때마다 서버→백엔드 왕복을 통째로 기다린다.
- 해결: TanStack Query v5 공식 스트리밍 패턴 — **`await` 를 제거하고 pending 쿼리를 dehydrate 로 스트리밍**한다.
  - 재방문/탭 전환 (핵심 목표) → 클라 캐시로 **즉시 완성 화면**
  - 첫 방문 → 이전 화면 유지 후 전환 (현행과 동일 — 스켈레톤 경계는 스코프 제외)
- **전수조사 핵심 발견**: 소비 훅 대부분이 `useSuspenseQuery`, 권한 redirect 를 가진 **레이아웃 3종의 await 는 유지 필수**, 중복 fetch 2건.

---

## 1. 전수조사 결과 (2026-07-20, dev 기준)

### 페이지 판정표

| 분류 | 페이지 | await 내용 | 필요 작업 |
|---|---|---|---|
| 🟢 안전한 언블로킹 | `tournament/[id]/result/group` | `prefetchQuery(['groupResult'])` — 이미 try/catch, 클라 `useQuery` + isPending/isError 처리 완비 | await 제거만 |
| 🟢 안전한 언블로킹 | `notification` | `prefetchInfiniteQuery(['notifications'])` — 클라 `useInfiniteQuery` + isPending 분기 있음 | await 제거 (+스켈레톤 권장, 현재 pending 시 빈 화면) |
| 🟡 언블로킹 (Suspense 소비) | `mypage` | `prefetchQuery(['me'])` — 소비 `useGetMe` = **useSuspenseQuery** | await 제거 (경계 미신설 — 첫 방문은 이전 화면 유지 = 현행 체감) |
| 🟡 언블로킹 (Suspense 소비) | `mypage/edit` | 동일 | 동일 |
| 🟡 언블로킹 (Suspense 소비) | `tournament/join/[id]` | `Promise.all([invitePreview, me])` — 소비 둘 다 useSuspenseQuery | 동일 |
| 🟡 중복 제거 | `tournament/[id]/create` | `Promise.all([tournament, me])` — `['tournament']` 는 **상위 layout 이 이미 시드 (중복!)** | tournament prefetch 삭제 + me await 제거 (create/layout 에 Suspense+Skeleton 기존재) |
| 🟡 중복 제거 | `mypage/withdraw` | `await getMe()` 직접 — **withdraw/layout 이 같은 걸 이미 await (이중 블로킹!)** | page 의 getMe 삭제, nickname 렌더를 클라 컴포넌트로 이동 |
| 🔴 유지 필수 | `tournament/[id]/match` | getTournament 로 redirect 분기 + `postStartTournament` 사이드이펙트 | 변경 금지 (loading.tsx 기존재) |
| 🔴 유지 필수 | `tournament/[id]/result` | status 기반 redirect | 변경 금지 |
| 🔴 유지 필수 | `login` | 인증 role redirect (#348 에서 세션 조회는 이미 제거됨) | 변경 금지 |
| ⚪ 이미 가벼움 | splash·home·legal 2종·archive 하위 3종·auth/callback·invite·play·by-wish·item·loading 등 11개 | params 급 또는 없음 | 없음 |

### 레이아웃 블로커 (페이지 await 를 지워도 남는 것)

| 레이아웃 | await | 판정 |
|---|---|---|
| `tournament/[id]/layout.tsx` | `getTournament` + 403/404 redirect + 캐시 시드 | **유지 필수** (권한) — 하위 페이지는 이 시드를 재사용해야 함 |
| `archive/layout.tsx` | `fetchQuery(['me'])` + MEMBER redirect | 유지 필수 |
| `mypage/withdraw/layout.tsx` | `fetchQuery(['me'])` + MEMBER redirect | 유지 필수 (단 page 의 중복 getMe 는 제거) |

### 설정 현황 (조사 시점 스냅샷 → #359 반영 결과)

- `utils/queryClient.ts`: staleTime 기본 60s / ~~`dehydrate.shouldDehydrateQuery` 미설정~~ → **✅ #359 에서 pending 포함 설정 완료**
- 개별 staleTime 오버라이드: 조사 시점 0건 → **✅ `useGetMe` 만 5분으로 상향** (그 외는 기본 60s 유지)
- loading.tsx: 전 라우트 통틀어 `tournament/[id]/match` **1개뿐**
- Suspense 소비 훅 (경계 필요): `useGetMe`, `useGetTournament`, `useGetInvitePreview`, `useGetWish`, `useGetTournamentItem`, `useGetTournamentList`

---

## 2. 해결 패턴

참고: [TanStack Query — Advanced Server Rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)

### 변경 ① — queryClient.ts (1회 설정, 모든 것의 전제)

```ts
import { defaultShouldDehydrateQuery } from '@tanstack/react-query';

defaultOptions: {
  queries: { retry: 1, staleTime: 60 * 1000, refetchOnWindowFocus: false },
  dehydrate: {
    // pending 쿼리도 dehydrate → RSC 가 fetch 완료를 기다리지 않고 스트리밍
    shouldDehydrateQuery: query =>
      defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
  },
},
```

### 변경 ② — 페이지 await 제거

```tsx
// Before
await queryClient.prefetchQuery({ queryKey: ['me'], queryFn: getMe });
// After — await 없음, promise 가 dehydrate 에 실려 스트리밍됨
queryClient.prefetchQuery({ queryKey: ['me'], queryFn: getMe });
```

### 변경 ③ — Suspense 경계는 신설하지 않는다 (스코프 결정)

`useSuspenseQuery` 소비 라우트는 경계가 없으면 첫 방문 시 App Router 전환 특성상
**이전 화면에 머물다가 데이터 도착 시 전환**한다 = 현행과 동일한 체감 (악화 없음).
핵심 목표인 **재방문/탭 전환은 캐시 히트로 suspend 없이 즉시** 렌더된다.
스켈레톤이 필요해지면 후속 이슈에서 loading.tsx 로 추가한다.

### 바뀌는 체감

| 시나리오 | 현재 | 리팩토링 후 |
|---|---|---|
| 재방문 (캐시 fresh) | 서버 왕복만큼 멈춤 | **즉시 완성 화면** |
| 첫 방문 | 이전 화면에 멈춘 채 대기 | 동일 (악화 없음 — 경계 신설은 후속 이슈) |

---

## 3. 실행 플랜 (커밋 단위)

| 단계 | 작업 | 리스크 |
|---|---|---|
| 1 | ✅ queryClient `shouldDehydrateQuery` 설정 | 완료 (#359) |
| 2 | ✅ 파일럿: `result/group` + `notification` await 제거 | 완료 (#359) |
| 3 | ✅ `mypage` · `mypage/edit` · `tournament/join/[id]` await 제거 | 완료 (#359) |
| 4 | ✅ 중복 정리: `create` tournament prefetch 삭제 · `withdraw` page getMe 삭제(+nickname 클라 이동) | 완료 (#359) |
| 5 | ✅ 추가 발견 반영: 홈 `tournament-list` 자식 RSC 언블로킹 · 탭바 착지 애니메이션 중 라우트 prefetch · me staleTime 5분 | 완료 (#359) |
| 6 | dev 배포 → 전환 체감 검증 (홈↔마이 왕복 즉시 렌더 등) | 남음 |

### 검증

1. 재방문 즉시성: 홈 ↔ mypage 왕복 (60초 내 2회째 즉시 렌더)
2. 첫 방문: 시크릿 모드 — 현행과 동일하게 동작하는지 (악화 없음 확인)
3. 앱 웹뷰 동일 시나리오
4. mutation 후 invalidate → 목록 갱신 회귀 확인
5. Lighthouse (배포 웹 기준) 전후 비교

---

## 4. 주의사항

- **redirect 를 쓰는 페이지/레이아웃은 await 제거 금지** — match, result, login, 레이아웃 3종
- `useSuspenseQuery` 를 `useQuery` 로 바꾸지 말 것 — 기존 패턴 유지, 경계로 해결
- `tournament/[id]/layout` 의 setQueryData 시드는 하위 페이지들이 의존 — 건드리지 않는다
- notification 은 isPending 시 빈 컨테이너 → 스켈레톤 추가 권장
- Next 라우터 캐시(`experimental.staleTimes`)는 별개 레버 — 이번 범위 밖

## 5. 관련 파일

| 파일 | 역할 |
|---|---|
| `apps/web/src/utils/queryClient.ts` | dehydrate 설정 (변경 ①) |
| `app/tournament/[id]/result/group/page.tsx`, `app/notification/page.tsx` | 파일럿 (변경 ②) |
| `app/mypage/page.tsx` · `edit/page.tsx` · `tournament/join/[id]/page.tsx` | 언블로킹 (경계 미신설) |
| `app/tournament/[id]/create/page.tsx` · `app/mypage/withdraw/page.tsx` | 중복 fetch 제거 |
| `app/tournament/[id]/match/page.tsx` · `result/page.tsx` · 레이아웃 3종 | 변경 금지 |
