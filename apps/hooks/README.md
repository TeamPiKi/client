# @piki/hooks

iOS 앱 배포 이벤트(EAS Build·Submit, App Store Connect)를 받아 허거덩 봇으로 Discord에 알리는 웹훅 수신기.
`apps/web`과 분리된 **별도 Vercel 프로젝트**로 배포한다 — 봇 토큰을 서비스 런타임과 격리하고, 알림 코드가 프로덕트 배포에 묶이지 않게 하기 위함. (#618)

## 동작 방식 — 버전당 스레드 1개

첫 빌드 완료 이벤트가 배포알림 채널에 **루트 상태판**을 올리고 스레드를 연다.
이후 이벤트는 최근 메시지에서 진행 중(`📦`로 시작) 루트를 찾아 상태판을 수정하고 스레드에 로그를 쌓는다.
별도 DB 없이 Discord 메시지 자체가 상태 저장소다. 출시·반려 시 제목이 `🎉`/`❌`로 바뀌며 사이클이 닫힌다.

```
📦 [iOS] PiKi v1.2.0 배포 진행 중          ← 이벤트마다 수정되는 상태판
• 심사용 (production): 심사 제출 완료
• 팀 테스트용 (production-dev): TestFlight 업로드 완료 — 처리 대기
• TestFlight 처리: 2건 완료
• 심사: 📮 대기 중
  └ 스레드: 🛠 빌드 완료 → ✅ 제출 완료 → … → 🎉 출시 완료!   ← append-only 로그
```

- **심사 표시는 대기·통과·출시·반려만** — 수동/자동 출시 구분은 통과 후 전이 상태로 드러난다
- **TestFlight 처리는 건수 집계** — ASC 페이로드에 빌드 식별 정보가 없어 어느 빌드인지 알 수 없다
- **무시 케이스** — 제출 취소·미매핑 상태·테스트 ping·미구독 이벤트는 200으로 조용히 응답 (재시도 유발 금지)

## 엔드포인트

| 경로 | 발신자 | 서명 검증 | 역할 |
| --- | --- | --- | --- |
| `POST /api/webhooks/eas-build` | EAS Build (BUILD 이벤트) | `expo-signature` — HMAC-SHA1 | 빌드 완료가 사이클(스레드)을 연다 |
| `POST /api/webhooks/eas` | EAS Submit (SUBMIT 이벤트) | `expo-signature` — HMAC-SHA1 | 심사 제출·TestFlight 업로드 기록 |
| `POST /api/webhooks/asc` | App Store Connect | `x-apple-signature` — HMAC-SHA256 | TestFlight 빌드 처리·심사 상태 전이 기록 |

## 런타임 요구사항

환경변수:

| 변수 | 용도 |
| --- | --- |
| `DISCORD_BOT_TOKEN` | 허거덩 봇 토큰 (GitHub Actions secret과 동일 값) |
| `DISCORD_DEPLOY_CHANNEL_ID` | 배포알림 채널 ID |
| `EAS_WEBHOOK_SECRET` | EAS 웹훅 서명 검증 키 (`eas webhook:create`에 넣은 값) |
| `ASC_WEBHOOK_SECRET` | ASC 웹훅 서명 검증 키 (ASC 웹훅 등록 시 입력한 Secret) |
| `EXPO_TOKEN` (선택) | EAS API로 빌드 프로필(심사용/팀 테스트용)·버전 조회. 없으면 해당 줄만 생략 |

봇에게 배포알림 채널의 **View Channel / Send Messages / Read Message History /
Create Public Threads / Send Messages in Threads** 권한이 필요하다 (루트 검색·스레드 기록).

웹훅·Vercel 프로젝트 등록 등 1회성 셋업 진행 상황은 #618 체크리스트에서 관리한다.
