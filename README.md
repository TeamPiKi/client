<div align="center">

<!-- 🎬 (Piki 로고 이미지) -->

# Piki

### Pick Together, Shop Better

**쌓인 위시리스트에서 먼저 살 것을 골라주는 소비 결정 서비스**

여러 쇼핑 플랫폼에 흩어진 위시템을 한곳에 모아, 1:1 토너먼트로 비교하고
친구와 함께 골라 "지금 살 하나"를 결정해요.

[![Website](https://img.shields.io/badge/Website-piki.day-38A5FF?style=flat-square)](https://piki.day)

![Next JS](https://img.shields.io/badge/Next-black.svg?style=for-the-badge&logo=next.js&logoColor=white)
![Expo](https://img.shields.io/badge/expo-1C1E24.svg?style=for-the-badge&logo=expo&logoColor=white)
![Turborepo](https://img.shields.io/badge/turborepo-%23EF4444.svg?style=for-the-badge&logo=turborepo&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

**삼십대 없는 팀** · 2026.03 – 현재

</div>

---

## 📑 목차

- [데모](#-데모)
- [서비스 소개](#-서비스-소개)
- [핵심 가치](#-핵심-가치)
- [핵심 기능](#-핵심-기능)
- [사용 흐름](#-사용-흐름)
- [기술 스택](#-기술-스택)
- [아키텍처](#-아키텍처)
- [기술적 도전](#-기술적-도전)
- [팀](#-팀)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)

---

## 🎬 데모

> 🎬 **(앱 전체 플로우: 위시 담기 → 토너먼트 → 결과 공유까지 한 번에 보여주는 대표 영상)**

|        GATHER · 위시 담기         |      PLAY · 토너먼트 비교       |        SHARE · 결과 공유        |
| :-------------------------------: | :-----------------------------: | :-----------------------------: |
| 🎬 (링크·이미지로 상품 담는 영상) | 🎬 (1:1 토너먼트로 고르는 영상) | 🎬 (결과 영수증 저장·공유 영상) |

---

## 💡 서비스 소개

### Saved a lot, bought nothing?

> 저장해둔 상품은 많은데, 결국 아무것도 사지 못한 경험 있지 않나요?

위시리스트와 장바구니는 가득한데, **선택 피로 때문에 구매를 계속 미루는** 20~30대 모바일 쇼핑 사용자를 위한 서비스예요. Piki는 쌓아둔 위시템을 **토너먼트로 비교해 직접 결정하게** 도와줍니다.

| 지표                               | 수치       |
| ---------------------------------- | ---------- |
| 국내 이커머스 평균 구매 전환율     | **1.33%**  |
| 장바구니 이탈률 (Cart Abandonment) | **70~85%** |

<sub>출처 · 빅인사이트 이커머스 전환 리포트, Baymard Institute</sub>

### No one was solving the decide layer.

위시리스트 앱 10여 개를 살펴보니 대부분 상품을 **모아두거나(Save & Organize) 선물하는 데** 머물러 있었어요.
Piki는 한 걸음 더 나아가, **혼자서도 결정을 끝낼 수 있고(Decide & Act)** 친구를 초대하면 게임처럼 함께 고를 수 있는 서비스로 방향을 잡았습니다.

> 🎬 **(포지셔닝 맵 / 문제 정의 이미지)**

---

## 🎯 핵심 가치

> **Indecisive shoppers can prioritize when options are gathered and compared through a tournament.**
> 선택을 미루던 쇼퍼도, 후보를 한곳에 모아 토너먼트로 비교하면 우선순위를 정할 수 있다.

| 구분     | 내용                                                            |
| -------- | --------------------------------------------------------------- |
| **Who**  | 구매 후보가 많아 결정을 미루는 20~30대 쇼핑 유저                |
| **How**  | 위시템을 한곳에 모아 1:1 토너먼트로 비교하고 친구 의견을 받는다 |
| **What** | 구매 결정 피로를 줄이고, 내 선택에 확신을 갖게 된다             |

---

## ✨ 핵심 기능

### 1. GATHER — Start with Your Wishes

무신사, 29CM, 지그재그 어디서 발견했든 원하는 상품을 Piki에 바로 가져와요.

- **위시에서 가져오기** — 내 위시리스트에서 상품을 가져오기
- **링크로 담기** — 상품 URL 붙여넣기
- **이미지로 담기** — 스크린샷 첨부로 담기
- **앱공유로 가져오기** — iOS 공유 익스텐션으로 다른 앱에서 바로 공유

> 🎬 **(상품 담기 4가지 방식 영상)**

### 2. INVITE — Some Choices Are Better Together

친구를 초대해 후보를 함께 모아요. 혼자 고민하기보다, 함께 고르면 더 즐거워요.

- **링크·초대 코드**로 친구 초대
- 초대받은 친구는 **회원가입 없이(게스트)** 바로 참여해 상품을 담을 수 있어요

> 🎬 **(친구 초대 → 게스트/멤버 참여 영상, 친구와 실시간으로 토너먼트 후보 담는 영상)**

### 3. PLAY — Pick the Better One

토너먼트 시작 전, 담긴 후보를 **비슷한 가격대끼리 자동 매칭**해 공정한 1:1 대진표를 만들어요.
이후 후보를 하나씩 선택하며 가장 갖고 싶은 아이템을 가려내고, 남은 선택 수와 대진표를 함께 보여줘 **결승까지 얼마나 왔는지** 한눈에 보이게 했어요.

> 🎬 **(1:1 토너먼트 플레이 영상)**

### 4. SHARE — Your Winner Is Here!

결과를 **영수증 형태로 저장·공유**해요. 친구도 같은 토너먼트에 참여해 서로의 선택을 비교할 수 있어요.

> 🎬 **(결과 영수증 공유 영상, 친구 토너먼트 결과 확인 영상)**

---

## 🔄 사용 흐름

```
   Add Wishlist Items  →  Invite Friends  →  1:1 Tournament  →  Save & Share
   위시템 담기            친구와 함께 담기     토너먼트로 결정      결과 공유
```

---

## 🛠 기술 스택

> 이 저장소는 **클라이언트(Web + App)** 레포지토리입니다. 서버는 별도 레포에서 관리해요.

| 구분         | 기술                                                                                    |
| ------------ | --------------------------------------------------------------------------------------- |
| **공통**     | TypeScript 5.9, Turborepo(모노레포), pnpm 10.17                                         |
| **Web**      | Next.js 16 (App Router), React 19, TanStack Query, Tailwind v4                          |
| **App**      | React Native + Expo                                                                     |
| **UI/모션**  | Radix UI, cva, Vaul, Sonner, Embla(캐러셀), GSAP(결과 연출), html-to-image(영수증 저장) |
| **실시간**   | SSE (`@microsoft/fetch-event-source`)                                                   |
| **모니터링** | Sentry                                                                                  |
| **인프라**   | Vercel (web), Expo (app)                                                                |
| **CI/CD**    | GitHub Actions (`lint` → `check-types` → `build`)                                       |

---

## 🏗 아키텍처

**RN(Expo) 앱이 WebView로 Next.js 웹앱을 감싸는 구조.**

실제 UI/비즈니스 로직은 웹(`Next.js`)에 집중하고, 네이티브 기능(딥링크·공유·토큰 저장 등)만 앱(`React Native`)에서 처리해요.

```
┌─────────────────────────────┐
│      apps/app (Expo)        │   네이티브: 딥링크/앱링크, iOS 공유 익스텐션,
│  ┌───────────────────────┐  │            SecureStore 토큰 저장
│  │   WebView             │  │
│  │  ┌─────────────────┐  │  │       @piki/core
│  │  │  apps/web       │  │  │◀──▶  (웹뷰 ↔ 네이티브 통신
│  │  │  (Next.js 16)   │  │  │       type / hook / util)
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

- **`apps/web`** — 메인 서비스. 모든 화면과 비즈니스 로직.
- **`apps/app`** — WebView 래퍼 + 네이티브 전용 기능.
- **`packages/core`** — 웹뷰 ↔ 네이티브 메시지 통신용 공용 type/hook/util.

---

## 🧗 기술적 도전

> 프로젝트를 진행하며 마주한 문제와 해결 과정.

- **웹뷰 ↔ 네이티브 토큰 동기화** — 네이티브 SecureStore와 WebView 세션 간 인증 토큰을 안전하게 동기화.
- **게스트 인증 플로우** — 초대받은 친구가 회원가입 없이 토너먼트에 바로 참여할 수 있도록 게스트 인증 설계.
- **iOS 공유 익스텐션** — 다른 쇼핑 앱에서 상품 링크를 Piki로 바로 공유해 담는 흐름 구현.
- **폴링 → SSE 전환** — 함께 담기·실시간 참여 상태를 서버 이벤트 스트림으로 전환해 부하 절감.
- **전역 에러 핸들링** — 4xx는 개별 처리, 5xx는 전역 처리로 분리한 일관된 에러 정책.
- **에러 모니터링** — Sentry 도입으로 운영 환경 이슈 추적 (web은 Session Replay 포함).
- **모노레포 컨벤션** — Colocation 기반으로 재사용 범위에 따라 코드 위치를 단계적으로 승격.

> 🎬 **(관련 다이어그램/스크린샷 — 필요 시)**

---

## 👥 팀

| 정선아                                                                                                                                              | 박소영                                                                                                                                                          | 강하은                                                                                                                                                    | 조영찬                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| <img src="https://github.com/iodio89.png" width="100"/>                                                                                             | <img src="https://github.com/soyeong0115.png" width="100"/>                                                                                                     | <img src="https://github.com/kanghaeun.png" width="100"/>                                                                                                 | <img src="https://github.com/ychany.png" width="100"/>                                                                                           |
| <a href="https://github.com/iodio89"><img src="https://img.shields.io/badge/iodio89-000?style=flat&logo=github&logoColor=white" alt="iodio89"/></a> | <a href="https://github.com/soyeong0115"><img src="https://img.shields.io/badge/soyeong0115-000?style=flat&logo=github&logoColor=white" alt="soyeong0115"/></a> | <a href="https://github.com/kanghaeun"><img src="https://img.shields.io/badge/kanghaeun-000?style=flat&logo=github&logoColor=white" alt="kanghaeun"/></a> | <a href="https://github.com/ychany"><img src="https://img.shields.io/badge/ychany-000?style=flat&logo=github&logoColor=white" alt="ychany"/></a> |

---

## 🚀 시작하기

### 요구 사항

- Node.js 20+
- pnpm 10.17

### 설치 & 실행

```bash
# 의존성 설치
pnpm install

# 전체 개발 서버 실행 (turbo)
pnpm dev

# 웹만 실행
pnpm dev:web

# 앱만 실행
pnpm dev:app
```

### 빌드

```bash
pnpm build          # 전체
pnpm build:web      # 웹만
```

---

## 📁 프로젝트 구조

```
piki/
├── apps/
│   ├── app/    # React Native + Expo (WebView 래퍼)
│   └── web/    # Next.js 16 (메인 서비스)
└── packages/
    └── core/               # @piki/core — 웹뷰 통신용 type/hook/util
```

<details>
<summary>폴더 배치 규칙 (Colocation)</summary>

코드는 **가장 가까운 사용처**에 두고, 재사용 범위가 넓어질 때만 한 단계씩 위로 승격해요.

| 재사용 범위              | 배치 위치                          |
| ------------------------ | ---------------------------------- |
| 단일 페이지 전용         | 라우트 폴더의 `_components/` 등    |
| 형제 라우트 간 공유      | 부모 라우트의 `_common/`           |
| top-level 라우트 간 공유 | `src/components/common/{name}/`    |
| 앱 전역 API/훅/유틸      | `src/apis/`, `hooks/`, `utils/` 등 |

</details>

---

<div align="center">

**Piki** · From Wish to Pick
Made with 💙 by 삼십대 없는 팀

</div>
