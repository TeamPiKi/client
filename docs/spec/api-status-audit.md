# API Status Code 프론트 대응 전수조사

> `api-json.json`(OpenAPI 스펙)에 정의된 모든 엔드포인트의 status code를 기준으로, 웹 프론트(`apps/web`)의 실제 대응 여부를 조사한 결과입니다.
> 범례: ✅ 대응됨 · ⚠️ 부분/애매(status 구분 없이 뭉뚱그림 등) · ❌ 미대응(무처리·주석·dead code) · N/A 프론트 무관

## 전역 동작 (공통 전제)

- **401**: `apis/client.ts` 인터셉터가 토큰 refresh 후 자동 재시도, 실패 시 로그인 리다이렉트 → clientApi 호출은 사실상 401 전역 커버. **단 `serverApi`(SSR)에는 응답 인터셉터가 없어** 서버 렌더 경로의 4xx/5xx는 그대로 throw.
- **잡히지 않은 throw / 5xx**: Next.js error boundary(`app/error.tsx`, `app/global-error.tsx`)의 "오류가 발생했어요" 페이지로 fallback.
- **`useSuspenseQuery` 기반 GET**: per-status 처리 없이 에러 시 error boundary로 fallback.
- **일반 `useQuery`/`useInfiniteQuery`**: QueryClient에 `throwOnError` 미설정(`utils/queryClient.ts`) → 에러가 boundary로도 안 가고, 컴포넌트가 `isError`를 안 보면 빈 상태로 표시될 수 있음.
- **에러 토스트**: sonner(`@/components/toast`), 주로 `error.response.data.detail`을 그대로 노출.

---

## 🚨 반드시 손봐야 할 미대응 (❌) 요약

| 위치 | 문제 |
| --- | --- |
| `useDeleteTournament.ts:31-33` | 토너먼트 삭제 실패(403/404/409/5xx) onError가 **주석 처리(`// TODO`)** — 실패 시 피드백 전무 |
| `useDeleteWishes.ts:24-28` | 위시 다건 삭제 실패(400/403) onError가 **`// TODO`만** — 무처리 |
| `usePostWishRefresh.ts` | 위시 새로고침 실패(400/403/404/409) **onError 자체가 없음** — 조용히 삼킴 |
| `usePostRecordMatch` / `useTournament.ts` | 매치 결과 기록 실패(모든 4xx) onError 전무 — 낙관적 진행/`console.error`만 |
| `usePostTournamentStart` (클라 버튼) | start 400/403/404 미처리 (409는 서버 매치 진입 경로에서만 복구) |
| `usePostCreateTournament` | 토너먼트 생성 400 미처리 |
| **502 미대응** | `usePostWishOCR`·`usePatchWish`·`usePostTournamentOCR`·`usePatchTournamentItem` 모두 `status===500`만 처리 → **502는 어느 분기도 안 탐** |
| `usePostGuestLogin` (클라) | 게스트 로그인 실패 onError 없음 — 무피드백 |
| `getAuthUrl` 사용부 (`LoginButtons`) | OAuth URL 조회 실패(400 등) `.catch`/try 없음 — 무피드백 |
| `usePostNotificationsRead` / `useGetNotifications` | 읽음 처리·목록 조회 400 무처리 |
| `useFcmTokenSync` | FCM 등록 실패 `.catch(console.error)`만 |
| **미구현 엔드포인트** | `GET /wishlists/{id}/history`(가격 히스토리), `GET /image-proxy`, `GET /announcements`, `GET /announcements/{id}`, `GET /tournaments/{id}/play-link-info` — 호출 코드 자체 없음 |
| **Dead code** | `POST /tournaments/{id}/join/guest` — api/훅 정의만 있고 소비처 없음 |

---

## 🔐 Auth

### POST /api/v1/auth/token/refresh · 200, 400, 401
- 200: ✅ 웹뷰는 토큰 쿠키/브릿지 저장·브라우저는 Set-Cookie·서버는 쿠키맵 갱신 후 원 요청 재시도
- 400: ✅ throw → 로그인 리다이렉트(인터셉터/서버 catch) — status 구분 없이 일괄
- 401: ✅ 400과 동일 (throw → 로그인 리다이렉트)

### POST /api/v1/auth/logout · 200, 401
- 200: ✅ 쿠키 삭제 + `queryClient.clear()` + 로그인으로 replace
- 401: ✅ 인터셉터 refresh, 실패해도 서버 액션이 쿠키 강제 삭제 → 로그아웃 보장

### POST /api/v1/auth/login/{provider} · 200, 400, 401, 502
- 200: ✅ analytics 로깅 + `['me']` invalidate + redirect
- 400: ⚠️ status/code 구분 없이 로그인 페이지 "다시 시도해 주세요" 토스트로 일괄
- 401: ⚠️ 인터셉터 refresh 후 실패 시 위와 동일 일괄 토스트
- 502: ⚠️ 동일 일괄 토스트 (502 전용 대응 없음)

### POST /api/v1/auth/guest · 201
- 201: ✅ `['me']` invalidate + (웹뷰) 쿠키/브릿지 저장 + redirect / 서버는 미인증 시 자동 게스트 로그인
- 실패: ❌ 클라 훅 `usePostGuestLogin`에 onError 없음 → 무피드백

### POST /api/v1/auth/apple/notifications · 200, 401, 502
- N/A: 서버-서버 웹훅(Apple→백엔드), 프론트에 호출 코드 없음

### POST /api/v1/auth/apple/callback · 302
- 302: ✅(간접) 백엔드 OAuth 브릿지가 `/auth/callback/apple`로 리다이렉트 → `CallbackHandler`가 후속 처리 (프론트가 302 직접 처리하진 않음)

### GET /api/v1/auth/{provider}/url · 200, 400
- 200: ✅ 반환 url로 이동(kakao/google/apple)
- 400: ❌ `.catch`/try 없는 프로미스 체인 — 실패 시 unhandled rejection, 무피드백

---

## 💛 Wishlist

### GET /api/v1/wishlists (목록) · 200, 400, 401, 403
- 200: ✅ `mapWishlist`로 items/커서 매핑
- 400 / 403: ⚠️ 개별 처리 없음 — suspense query throw → error boundary
- 401: ✅ 전역 인터셉터

### POST /api/v1/wishlists (URL 등록) · 201, 400, 401, 403
- 201: ✅ analytics + `['wishlists']` invalidate + archive 이동
- 400: ✅ `status<500` 분기로 `detail` 토스트
- 401: ✅ 전역 인터셉터
- 403: ✅ detail 토스트(단 403 전용 로그인 이동 등은 없음)

### DELETE /api/v1/wishlists (다건 삭제) · 200, 400, 401, 403
- 200: ✅ invalidate + 성공 토스트 "선택한 위시를 삭제했어요"
- 400 / 403: ❌ onError에 `// TODO: 에러처리`만 — 무처리
- 401: ✅ 전역 인터셉터

### POST /api/v1/wishlists/{wishId}/refresh (새로고침) · 200, 400, 401, 403, 404, 409
- 200: ✅ invalidate + `router.back()`
- 400 / 403 / 404 / 409: ❌ **onError 자체가 없음** → 에러 조용히 삼킴
- 401: ✅ 전역 인터셉터

### POST /api/v1/wishlists/images (이미지 등록/OCR) · 201, 400, 401, 403, 502
- 201: ✅ analytics + invalidate + archive 이동
- 400: ✅ `detail` 토스트(개수/형식/크기 초과)
- 401: ✅ 전역 인터셉터
- 403: ✅ detail 토스트 + (게스트) 로그인 페이지 replace
- 502: ❌ 미대응 — 400/403만 분기, 5xx는 무처리(throw도 없음)

### GET /api/v1/wishlists/{wishId} (단건) · 200, 401, 403, 404
- 200: ✅ data 반환
- 401: ✅ 전역 인터셉터
- 403 / 404: ⚠️ 개별 처리 없음 — suspense query throw → error boundary

### DELETE /api/v1/wishlists/{wishId} (단건 삭제) · 200, 401, 403
- 200: ✅ invalidate + 성공 토스트 + archive replace
- 401: ✅ 전역 인터셉터
- 403: ✅ detail 토스트(삭제 권한 없음) — (참고: 404 detail 토스트, 500 고정 문구 토스트도 대응)

### PATCH /api/v1/wishlists/{wishId} (복구/추출 보정) · 200, 400, 401, 403, 404, 409, 502
- 200: ✅ invalidate + `router.back()`
- 400: ❌ onError 분기(403/404/409/500)에 400 없음 — 무처리
- 401: ✅ 전역 인터셉터
- 403 / 404 / 409: ✅ detail 토스트 + archive replace
- 502: ❌ 미대응 — `status===500`만 처리, 502는 안 걸림

### GET /api/v1/wishlists/{wishId}/history (가격 히스토리) · 200, 401, 403, 404
- ❌ **프론트 미구현** — ENDPOINTS 상수·api·hook 전무 (기존 'history'는 전부 토너먼트 기록)

---

## 🏆 Tournament / Tournament Item

### GET /api/v1/tournaments (목록) · 200, 401
- 200: ✅ 데이터 반환 / 401: ✅ 전역(서버렌더 미인증은 throw→boundary) / 기타 ⚠️ error boundary

### POST /api/v1/tournaments (생성) · 201, 400, 401
- 201: ✅ analytics + list invalidate + create 이동
- 400: ❌ 훅 onError 없음 → throw
- 401: ✅ 전역

### POST /api/v1/tournaments/{id}/start · 200, 400, 401, 403, 404, 409
- 200: ✅ 응답 tournamentId로 라우팅
- 400 / 403 / 404: ❌ 두 경로(서버 매치 진입·클라 버튼) 모두 미처리
- 401: ✅ 전역
- 409: ⚠️ **서버 매치 진입 경로만** 최신 상태 재조회로 복구, **클라 버튼 경로는 미처리**

### POST /api/v1/tournaments/{id}/play-link · 200, 401, 403, 404, 409
- 200: ✅ 링크 생성 후 공유
- 401: ✅ 전역
- 403 / 404 / 409: ⚠️ 소비처 try/catch가 모든 에러를 단일 토스트("공유 링크를 생성하지 못했어요")로 통합

### POST /api/v1/tournaments/{id}/matches (매치 결과) · 200, 400, 401, 403, 404, 409
- 200: ✅ 캐시 갱신/라운드 전환/결승 시 result 이동
- 400 / 401 / 403 / 404 / 409: ❌ onError 전무 — 낙관적 진행, 조회 실패는 `console.error`만

### POST /api/v1/tournaments/{id}/join (인증 참여) · 200, 400, 401, 404, 409
- 200: ✅ create 페이지(WELCOME_JOIN)로 이동
- 400 / 404: ⚠️ 전용 분기 없이 공통 토스트/`state='invalid'` fallback
- 401: ✅ 전역
- 409: ✅ `TournamentErrorDialog type="LINK_EXPIRED"` 명시 노출

### POST /api/v1/tournaments/{id}/join/guest (게스트 참여) · 201, 400, 404, 409
- ❌ **Dead code** — api/훅 정의만 있고 소비처 없음, 전 status 미대응

### POST /api/v1/tournaments/{id}/items/wish (위시 추가) · 200, 400, 401, 403, 404, 409
- 200: ✅ invalidate + create 이동
- 400 / 401 / 403 / 404 / 409: ⚠️ status 무관 단일 토스트("위시템 추가에 실패했어요")

### POST /api/v1/tournaments/{id}/items/link (URL 추가) · 200, 400, 401, 403, 404, 409
- 200: ✅ invalidate
- 400 / 403 / 404 / 409: ✅ `status<500` → `detail` 토스트(라우팅/복구 없이 토스트만)
- 401: ✅ 전역 / 5xx: ✅ throw → error boundary

### POST /api/v1/tournaments/{id}/items/images (이미지 OCR) · 200, 400, 401, 403, 404, 409, 502
- 200: ✅ invalidate
- 400: ✅ detail 토스트
- 401: ✅ 전역
- 403 / 404 / 409: ✅ 토스트 + `router.replace(HOME)`
- 502: ❌ 미대응 — `status===500`만 처리, 502 무피드백

### POST /api/v1/tournaments/{sourceId}/from-play-link · 200, 401, 404, 409
- 200: ✅ 상태별 라우팅(create/match/result)
- 401: ✅ 전역 + 401/400 시 게스트 자동 발급 후 재시도
- 404 / 409: ✅ `state='expired'` → "플레이 링크 유효하지 않음" 안내 화면(통합)

### GET /api/v1/tournaments/{id}/items/{itemId} (아이템 단건) · 200, 401, 403, 404
- 200: ✅ / 401: ✅ 전역 / 403 · 404: ❌ 개별 미처리 → error boundary

### DELETE /api/v1/tournaments/{id}/items/{itemId} · 200, 401, 403, 404, 409
- 200: ✅ invalidate + create 페이지 replace
- 401: ✅ 전역
- 403 / 404 / 409: ✅ detail 토스트 + create replace / 5xx: ✅ 서버오류 토스트

### PATCH /api/v1/tournaments/{id}/items/{itemId} · 200, 400, 401, 403, 404, 409, 502
- 200: ✅ invalidate + `router.back()`
- 400: ✅ `status<500` → detail 토스트
- 401: ✅ 전역
- 403 / 404 / 409: ✅ 토스트 + create replace
- 502: ⚠️ `status<500` 조건에서 제외 → 토스트 없이 throw → error boundary

### PATCH /api/v1/tournaments/{id}/invite (초대 마감 수정) · 200, 400, 401, 403, 404, 409
- 200: ✅ invalidate + 성공 토스트
- 400 / 403 / 404 / 409: ⚠️ 소비처가 status 무관 단일 토스트("마감 시각을 변경하지 못했어요")
- 401: ✅ 전역

### GET /api/v1/tournaments/{id} (단건) · 200, 401, 403, 404
- 200: ✅ / 401: ✅ 전역 / 403 · 404: ❌ 개별 미처리 → error boundary

### DELETE /api/v1/tournaments/{id} · 200, 401, 403, 404, 409
- 200: ✅ invalidate + 성공 토스트
- 401: ✅ 전역
- 403 / 404 / 409 / 5xx: ❌ **onError가 주석 처리(`// TODO: 에러 처리`)** — 완전 미대응

### GET /api/v1/tournaments/{id}/play-link-info · 200, 404, 409
- ❌ **프론트 미구현** — 상수·호출 코드 없음

### GET /api/v1/tournaments/{id}/invite-preview · 200, 404, 409
- 200: ✅ / 404 · 409: ⚠️ suspense query 경로 개별 미처리 → error boundary (InviteClient는 by-code로 프리체크)

### GET /api/v1/tournaments/{id}/group-result · 200, 401, 403, 404, 409
- 200: ✅ / 401: ✅ 전역
- 403 / 404 / 409: ✅ 통합 대응 — prefetch 실패 무시 + "아직 친구 결과가 없어요" 안내 화면

### GET /api/v1/tournaments/by-invite-code · 200, 400, 409
- 200: ✅ join 페이지 라우팅
- 400: ✅ `InvalidCodeDialog`(코드 불일치) / `state='invalid'`
- 409: ✅ `TournamentErrorDialog LINK_EXPIRED`

---

## 👤 User

### GET /api/v1/users/me · 200, 401, 404
- 200: ✅ UserT 반환(`['me']`)
- 401: ✅ 전역(client) / 서버 경로는 인터셉터 없어 throw → boundary
- 404: ❌ 전용 처리 없음 — suspense query throw → error boundary

### DELETE /api/v1/users/me (회원 탈퇴) · 200, 401, 403, 404
- 200: ✅ 토큰 삭제 + `queryClient.clear()` + ROOT redirect
- 401: ✅ 전역
- 403 / 404: ⚠️ code 구분 없이 공통 토스트 "잠시 후 다시 시도해주세요." + dialog 닫힘

### PATCH /api/v1/users/me (정보 수정) · 200, 400, 401, 403, 404, 409, 413, 502
- 200: ✅ `['me']` invalidate + `router.replace(MYPAGE)`
- 400 / 403 / 404: ⚠️ code 구분 없이 서버 `detail` 토스트
- 401: ✅ 전역
- 409(닉네임 중복 등): ⚠️ detail 토스트로 통합(닉네임은 제출 전 사전검증으로 도달 드묾)
- 413(이미지 용량 초과): ⚠️ **클라 사전 용량검증 없음** — 서버 413 detail 토스트에만 의존
- 502: ⚠️ response 있으면 detail 토스트, 네트워크성으로 response 없으면 early return → 무처리

### GET /api/v1/users/nickname/check · 200, 400, 401
- 200: ✅ `available` 판정, false면 인라인 에러 "이미 사용 중인 닉네임이에요."
- 400: ✅ 서버 detail을 인라인 필드 에러로 표시
- 401: ✅ 전역

---

## 🔔 Notification / FCM

### POST /api/v1/notifications/read · 200, 400, 401
- 200: ✅ `['notifications']` invalidate + 웹뷰 badge 업데이트
- 400: ❌ onError 미정의 — 무처리(읽음 표시/이동만 낙관적 진행)
- 401: ✅ 전역

### GET /api/v1/notifications · 200, 400, 401
- 200: ✅ items/unreadCount/커서 페이지네이션
- 400: ❌ throwOnError 미설정 + isError 미참조 — 에러 시 빈 상태로 표시될 수 있음
- 401: ✅ 전역

### GET /api/v1/notifications/subscribe (SSE) · 200, 401
- 200: ✅ 이벤트별(notification/silent-sync) 토스트 + 쿼리 invalidate, 재시도 delay 리셋
- 401: ✅ onopen에서 `refreshClientToken()` 후 재연결, 실패 시 연결 중단
- (재연결/에러: ✅ 지수 backoff 수동 재연결, 초기 1s→최대 30s)

### POST /api/v1/fcm/tokens (등록/갱신) · 200, 400, 401
- 200: ✅ `device_id` 쿠키 저장
- 400: ❌ `.catch(console.error)`만 — 사용자 UI 대응 없음
- 401: ✅ 전역

### DELETE /api/v1/fcm/tokens (기기 해제) · 200, 400, 401
- 200: ✅ 로그아웃 흐름 계속 진행
- 400: ⚠️ try/catch로 의도적 무시(FCM 해제 실패해도 로그아웃 진행)
- 401: ⚠️ serverApi에 인터셉터 없어 reject되나 catch가 삼킴

---

## 🖼️ Image Proxy / 📢 Announcement (전부 미구현)

### GET /api/v1/image-proxy · 200, 400, 401, 502
- ❌ **프론트 미구현** — 상수·호출 코드 없음 (이미지는 next Image/base-image로 직접 렌더)

### GET /api/v1/announcements · 200, 400, 401
- ❌ **프론트 미구현** — 관련 페이지/훅/api 전무

### GET /api/v1/announcements/{id} · 200, 401, 404
- ❌ **프론트 미구현**

---

> ℹ️ Dev 태그 엔드포인트(`/api/v1/dev/*`)는 개발·테스트 전용(운영 비활성)이라 조사 대상에서 제외했습니다.

---

## 📌 코드베이스 내 TODO 주석 (남은 작업)

> `apps/web/src` 전체에서 `TODO`/`FIXME` 주석을 수집한 목록입니다. 위 status 대응과 별개로 남아있는 작업들입니다.

### 에러 처리 관련 (위 status 조사와 직접 연결)
- `app/archive/_hooks/useDeleteWishes.ts:27` — `// TODO: 에러처리` (위시 다건 삭제 실패 미대응)
- `hooks/useDeleteTournament.ts:28` — `// TODO: 에러 처리` (토너먼트 삭제 실패 미대응)
- `app/tournament/[id]/layout.tsx:32` — `notFound(); // TODO: 아직 미정` (토너먼트 404 처리 방식 미확정)
- `app/invite/[id]/_components/InviteClient.tsx:134` — 409가 초대 코드 만료·이미 참여·이미 시작 등 여러 경우인데 **서버가 에러코드를 안 내려줘** 단일 타입으로만 처리 중 (동적 타입 분기 필요)

### UI / 페이지 미완성
- `app/global-error.tsx:13` — `// TODO: 임시 글로벌 에러 페이지 - 디자인 변경 필요`
- `app/archive/_components/FabMenu.tsx:18` — 아이템 추가 페이지 생기면 연결
- `components/dialog/index.tsx:68` — `{/** TODO: 수정 필요 */}`
- `components/header/ProfileHeaderIcon.tsx:42` — 버튼 액션 정해지면 활성화 예정 (현재 작동 안 하는 버튼 숨기려 주석 처리)

### 서버 API 의존 (백엔드 추가 대기)
- `components/tournament-card/MorePopover.tsx:89` — IN_PROGRESS 참여자 API 추가되면 친구 목록 보기 노출

### 리팩터링
- `app/mypage/_actions/logout.ts:24` — `serverApi.post(AUTH_LOGOUT)` 중복 호출 수정하기
