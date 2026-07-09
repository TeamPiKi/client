import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

/**
 * SSR(serverApi baseURL / next.config rewrites)이 실서버에 닿지 않도록 죽은 로컬 주소를 강제.
 * SSR prefetch는 즉시 실패하고, 브라우저 재요청은 page.route 목으로 처리된다(결정성 보장).
 *
 * 로컬 주의: 실서버 API로 이미 떠 있는 dev 서버를 reuseExistingServer로 재사용하면
 * SSR prefetch가 실서버에 닿을 수 있다. 완전 결정적 실행은 dev 서버를 내리고
 * `NEXT_PUBLIC_API_URL=http://127.0.0.1:4010 pnpm build && CI=1 pnpm test:e2e` 사용.
 */
const DEAD_API_URL = 'http://127.0.0.1:4010';

export default defineConfig({
  testDir: './e2e',
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
    env: { NEXT_PUBLIC_API_URL: DEAD_API_URL },
  },
});
