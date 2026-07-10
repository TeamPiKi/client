# 에러 처리 정책 (Error Handling Policy)

> API 응답 실패를 **어느 계층에서 어떻게 처리할지**에 대한 팀 공통 규약입니다.
> 관련: [`api-status-audit.md`](./api-status-audit.md) (전수조사) · [`issues/EPIC-api-status-response.md`](./issues/EPIC-api-status-response.md) (대응 이슈)

---

## TL;DR

- **4xx (클라이언트/비즈니스 오류)** → **개별(호출부) 처리.** 원인별로 사용자 행동이 달라지므로 맞춤 UX.
- **5xx · 네트워크 오류** → **전역 처리.** 사용자가 할 수 있는 게 없으므로 공통 "일시적 오류" 토스트 + Sentry.
- **401 (인증 만료)** → **전역 인터셉터**가 토큰 refresh 후 자동 재시도, 실패 시 로그인 redirect.
- **인증/권한 게이팅** → **layout 가드(SSR)** 가 진입 시점에 차단.
- **조용히 실패 금지** → 개별 onError가 없어도 **전역 안전망**이 최소 토스트를 보장.

---

## 처리 계층 (요청 하나가 실패했을 때 걸리는 순서)

```text
① 전역 인터셉터   apis/client.ts            → 401 자동 refresh / 재시도 / 로그인 redirect
② Layout 가드     app/**/layout.tsx (SSR)   → 진입 시점 인증·권한 차단 (getMe 등)
③ 전역 MutationCache onError  utils/queryClient.ts
                                            → 5xx·네트워크 공통 처리 (+ Sentry)
                                            → 4xx인데 개별 처리 없으면 generic 토스트
④ 개별 onError    각 use*Mutation 훅         → 4xx 맞춤 UX (토스트/이동/롤백/전용 다이얼로그)
⑤ Error boundary  app/error.tsx / global-error.tsx
                                            → 렌더·RSC·suspense query throw fallback
```

> 위에서 걸린 건 아래에서 다시 처리하지 않는다. (예: 401은 ①에서 끝 → 개별 onError에서 401 분기 금지)

---

## Status 등급별 처리 주체

| Status | 의미 | 처리 주체 | 처리 방식 |
| --- | --- | --- | --- |
| **200/201** | 성공 | 개별 | onSuccess |
| **302** | 리다이렉트 | (백엔드/브라우저) | 프론트 직접 처리 X |
| **400** | 잘못된 요청/검증 | **개별** | 인라인 에러 or `detail` 토스트 |
| **401** | 인증 만료 | **전역 인터셉터 ①** | refresh → 재시도 → 실패 시 로그인 |
| **403** | 권한 없음 | **layout ② or 개별 ④** | 게스트/미인증 = layout redirect · 그 외 = 개별 토스트 |
| **404** | 리소스 없음 | **layout ② or 개별 ④** | 진입 게이팅은 layout · 액션 실패는 개별 |
| **409** | 충돌(만료/중복/이미 시작) | **개별** | 전용 다이얼로그/안내 (원인별 UX 큼) |
| **413** | 용량 초과 | **개별 (+ 사전검증)** | 업로드 전 클라 용량 체크 우선 |
| **5xx · 네트워크** | 서버/통신 오류 | **전역 MutationCache ③** | 공통 "일시적 오류" 토스트 + Sentry |

---

## 계층별 상세

### ① 401 — 전역 인터셉터 (`apis/client.ts`)

- 401 응답 시 자동으로 `refreshClientToken()` → 원 요청 1회 재시도
- refresh 실패 시 로그인 페이지로 redirect (단 LOGIN/ROOT/auth callback 경로는 제외)
- **개별 훅에서 401을 따로 처리하지 않는다** (전역이 담당)
- 주의: `serverApi`(SSR)에는 이 인터셉터가 없다 → SSR 경로의 401은 layout/에러바운더리에서 처리

### ② 인증·권한 게이팅 — Layout 가드 (SSR)

일부 4xx는 **"화면 진입 자체를 막는" 문제**라 개별 onError가 아니라 layout에서 처리한다.

- 예: `app/archive/layout.tsx` — SSR에서 `getMe` 조회
  - `identityType !== 'MEMBER'` (게스트) → 로그인 redirect
  - `getMe`가 401/404 → 로그인 redirect (세션 만료)
- 예: `app/tournament/[id]/layout.tsx` — 404 → `notFound()`
- **그래서 개별 액션에서 중복 처리 불필요한 경우가 있다:**
  - 위시 삭제의 403(게스트) → archive layout이 진입에서 이미 차단 → 삭제 onError에서 재처리 X
  - "본인 위시 아닌 항목" 403 → `GET /wishlists`가 본인 것만 반환하므로 정상 UI에선 선택 불가 → 개별 분기 X (도달 시 전역 안전망이 덮음)

> **판단 기준**: "이 4xx가 화면 진입 조건(로그인/멤버/존재 여부)인가?" → 예면 layout, 아니면 개별.

### ③ 5xx · 네트워크 — 전역 MutationCache onError (`utils/queryClient.ts`)

- **5xx(500/502/503…)와 네트워크 오류(`error.response` 없음)는 전역이 단독으로 처리한다.**
  - 공통 토스트 ("일시적인 오류예요. 잠시 후 다시 시도해 주세요.") + `Sentry.captureException`
- **개별 onError는 5xx를 건드리지 않는다** (아래 개발 규칙 참고) → 토스트 중복 방지
- 4xx인데 개별 onError가 없으면 전역이 generic 토스트로 fallback (silent failure 방지)

### ④ 4xx — 개별 onError (각 mutation 훅)

- 400/403(비게이팅)/404(액션)/409/413은 **원인별로 사용자 행동이 다르므로 호출부에서 맞춤 처리**
- 처리 예: 검증 에러 인라인 표시, 만료 다이얼로그, 낙관적 업데이트 롤백, `detail` 토스트
- **4xx만 분기한다. 5xx 브랜치를 두지 않는다.**

> ⚠️ **전역 4xx fallback은 개별 onError가 "없을 때만" 작동한다** (`if (mutation.options.onError) return`).
> 그래서 개별 onError는 **"4xx 전부 책임" 또는 "아예 없음(전역 위임)"** 둘 중 하나여야 한다.
> - **비어있는 onError**(`// TODO`만) → 존재로 취급돼 전역이 양보 → silent. **삭제할 것.**
> - **부분 onError**(일부 4xx만) → 빠진 4xx는 개별도 전역도 안 잡음 → silent. **도달 가능한 4xx를 전부 채울 것.**
>
> **전역 net(③)이 커버하지 못하는 것** (= 개별에 반드시 남겨야 하는 것):
> - **낙관적 업데이트 롤백** — 전역은 토스트만, 상태 되돌림은 개별 `onMutate`/`onError`
> - **맞춤 4xx UX** — 이동/전용 다이얼로그/인라인 에러
> - **query(GET) 에러** — `MutationCache`는 mutation만 → `isError`/error boundary로 별도 처리
> - **react-query 밖 호출** — 생 `fetch`/`.then` (예: `getAuthUrl`)은 전역 net이 안 잡음 → 직접 `catch`

### ⑤ GET(query) 실패

> **query는 mutation과 다르게 다룬다. 전역 "토스트" 금지 — 전역은 "로깅"만.**
> 배경 refetch/retry가 실패할 때마다 토스트가 스팸되고, query 에러는 보통 그 자리(리스트 영역)에 인라인으로 보여야 하기 때문.

| 종류 | 처리 | 작업 |
| --- | --- | --- |
| **suspense query** (`useSuspenseQuery` 등) | throw → `app/error.tsx` 에러바운더리 (이미 있음) | 추가 작업 없음 |
| **일반 query** (`useQuery`/`useInfiniteQuery`) | 컴포넌트에서 **`isError` 분기** → "불러오기 실패 + 재시도" UI | 해당 컴포넌트만 |
| **전역 `QueryCache.onError`** | **Sentry 로깅만** (토스트 X) | 설정 1곳 |

- 일반 query는 **"빈 상태(데이터 없음)"와 "불러오기 실패"를 반드시 구분**해 표시할 것 (예: 알림 목록)
- **하지 말 것**:
  - ❌ query 전역 토스트 (배경 refetch 스팸)
  - ❌ 전역 `throwOnError: true` (리스트 일부 실패에도 화면 전체가 에러 페이지로) — 페이지 전체가 한 데이터에 의존하는 화면에서만 **개별적으로** 켤 것

---

## 개발 규칙 (체크리스트)

- [ ] mutation 훅의 `onError`는 **4xx만** 분기한다. `status === 500` / `else`로 5xx를 토스트하지 않는다 (전역이 담당)
- [ ] 401은 개별에서 처리하지 않는다 (전역 인터셉터)
- [ ] 화면 진입 조건(로그인/멤버/존재)인 4xx는 layout에서 처리한다
- [ ] "정상 UI에선 도달 불가"한 status는 개별 분기하지 않는다 (전역 안전망 + Sentry가 덮음)
- [ ] 일반 query는 `isError`를 분기해 에러 UI를 노출한다
- [ ] 에러 메시지는 `getApiErrorMessage(error)`로 통일한다

---

## 유틸: `getApiErrorMessage(error)`

에러 → 사용자 문구 변환을 한 곳으로 일원화한다.

```ts
// utils/getApiErrorMessage.ts
export const getApiErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiErrorResponseT>(error)) {
    const status = error.response?.status;
    if (!status || status >= 500) return '일시적인 오류예요. 잠시 후 다시 시도해 주세요.';
    return error.response?.data?.detail ?? '요청을 처리하지 못했어요.';
  }
  return '요청을 처리하지 못했어요.';
};
```

---

## 전역 안전망 최종 코드 (`utils/queryClient.ts`)

```ts
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

const makeQueryClient = () =>
  new QueryClient({
    // mutation — 사용자 액션 실패: 토스트 + 로깅
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) => {
        const status = isAxiosError(error) ? error.response?.status : undefined;
        const isServerError = !status || status >= 500; // 5xx + 네트워크

        if (isServerError) {
          toast.error(getApiErrorMessage(error));
          // Sentry.captureException(error);
          return; // 5xx는 전역 독점 → 개별은 5xx 토스트 금지
        }
        // 4xx: 개별 onError 있으면 양보, 없으면 generic fallback
        if (mutation.options.onError) return;
        toast.error(getApiErrorMessage(error));
      },
    }),
    // query — 데이터 fetch 실패: 토스트 X, 로깅만 (표시는 boundary/isError)
    queryCache: new QueryCache({
      onError: (_error) => {
        // Sentry.captureException(_error); // 로깅만! 토스트 금지
      },
    }),
    defaultOptions: {
      queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false },
    },
  });
```

> ⚠️ `MutationCache.onError`와 개별 `onError`는 **둘 다 실행**된다. 그래서 개별 훅이 5xx를 토스트하면 전역과 중복된다 → 개별은 반드시 4xx만.
> ⚠️ `QueryCache.onError`는 **로깅 전용**. 토스트를 넣으면 배경 refetch마다 스팸된다.

---

## "도달 불가" 케이스는 어떻게?

정상 UI 흐름에선 발생할 수 없는 status(예: 남의 위시 403)는:

- **개별 전용 UX를 만들지 않는다** (죽은 코드 방지)
- 대신 **전역 안전망 + Sentry**로 덮어 "조용히 실패/크래시"만 막는다
- 만약 Sentry에 실제로 찍히면 → "불가능하다던 가정이 깨졌다"는 신호로 삼아 원인 추적

원칙 한 줄: **명시적 처리는 "도달 가능 + 사용자 행동이 바뀌는 것"만. 그 외 전부는 전역 안전망으로 "조용히 실패 금지".**
