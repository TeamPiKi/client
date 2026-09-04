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

## 엔드포인트

| 경로 | 발신자 | 서명 검증 |
| --- | --- | --- |
| `POST /api/webhooks/eas-build` | EAS Build (BUILD 이벤트) | `expo-signature` — HMAC-SHA1 |
| `POST /api/webhooks/eas` | EAS Submit (SUBMIT 이벤트) | `expo-signature` — HMAC-SHA1 |
| `POST /api/webhooks/asc` | App Store Connect | `x-apple-signature` — HMAC-SHA256 |

## Vercel 프로젝트 설정

1. Vercel에서 **Add New Project** → 이 레포 선택 → Root Directory를 `apps/hooks`로 지정 (Framework: Other)
2. 환경변수 등록:
   - `DISCORD_BOT_TOKEN` — 허거덩 봇 토큰 (GitHub Actions secret과 동일 값)
   - `DISCORD_DEPLOY_CHANNEL_ID` — 배포알림 채널 ID
   - `EAS_WEBHOOK_SECRET` — 16자 이상 임의 문자열 (아래 EAS 등록 시 같은 값 사용)
   - `ASC_WEBHOOK_SECRET` — ASC 웹훅 등록 시 입력한 Secret과 같은 값
   - `EXPO_TOKEN` (선택) — expo.dev Access Token (robot 권장). 있으면 제출 이벤트에서
     빌드 프로필(심사용/팀 테스트용)·버전을 조회해 상태판에 반영, 없으면 로그만 남는다

봇에게 배포알림 채널의 **View Channel / Send Messages / Read Message History /
Create Public Threads / Send Messages in Threads** 권한이 필요하다 (루트 검색·스레드 기록).

## 웹훅 등록

**EAS** (레포의 `apps/app`에서 실행, 시크릿은 둘 다 같은 값):

```sh
eas webhook:create --event BUILD --url https://<hooks-domain>/api/webhooks/eas-build --secret <EAS_WEBHOOK_SECRET>
eas webhook:create --event SUBMIT --url https://<hooks-domain>/api/webhooks/eas --secret <EAS_WEBHOOK_SECRET>
```

**App Store Connect** (계정 Admin):
App Store Connect → Users and Access → Integrations → Webhooks → `+`
URL에 `https://<hooks-domain>/api/webhooks/asc`, Secret에 `ASC_WEBHOOK_SECRET` 값 입력 후
이벤트로 **Build upload state changes**, **App version state changes** 선택.
