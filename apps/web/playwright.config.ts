import { defineConfig, devices } from '@playwright/test';

import { BASE_URL, MOCK_API_URL } from './e2e/consts';

/**
 * NEXT_PUBLIC_API_URL 을 로컬 목 스텁 주소로 강제해 실서버 접근을 차단한다(결정성 보장).
 * - SSR(serverApi/RSC 레이아웃) 발 요청 → globalSetup 이 띄우는 목 스텁 서버가 응답
 * - 브라우저 발 요청 → mockApiFixture 의 page.route 목이 응답
 *
 * 로컬 주의: 실서버 API로 이미 떠 있는 dev 서버를 reuseExistingServer로 재사용하면
 * SSR 요청이 실서버에 닿을 수 있다. 완전 결정적 실행은 dev 서버를 내리고
 * `NEXT_PUBLIC_API_URL=http://127.0.0.1:4010 pnpm build && CI=1 pnpm test:e2e` 사용.
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/setup/globalSetup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    /** 가짜 게스트 JWT로 storageState 생성 — 브라우저·네트워크 불필요 */
    { name: 'setup', testMatch: /.*\.setup\.ts$/ },
    {
      name: 'mobile-chromium',
      use: {
        ...devices['iPhone 14'],
        /** CI에 chromium만 설치하기 위한 override — 뷰포트/UA/터치는 iPhone 14 유지 */
        browserName: 'chromium',
        storageState: 'playwright/.auth/guest.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    /** CI: 워크플로우 스텝에서 미리 빌드한 뒤 start만 수행 (빌드 실패 로그 가시성) */
    command: process.env.CI ? 'pnpm start' : 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { NEXT_PUBLIC_API_URL: MOCK_API_URL },
  },
});
