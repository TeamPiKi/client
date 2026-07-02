import * as Sentry from '@sentry/nextjs';

/** production/staging 에서만 수집 (dev/local 비활성) */
const stage = process.env.NEXT_PUBLIC_STAGE;
const enabled = stage === 'production' || stage === 'staging';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: stage,
  enabled,
  ...(process.env.NEXT_PUBLIC_WEB_VERSION ? { release: process.env.NEXT_PUBLIC_WEB_VERSION } : {}),
  /** Performance(Tracing)는 초기엔 off */
  tracesSampleRate: 0,
  /** Session Replay — 에러 발생 세션만 녹화 */
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  /** PII 기본 마스킹 */
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
