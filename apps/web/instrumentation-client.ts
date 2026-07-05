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
      /** 렌더된 콘텐츠·이미지는 노출(디버깅용), 유저가 타이핑하는 입력창만 마스킹 */
      maskAllText: false,
      blockAllMedia: false,
      maskAllInputs: true,
      mask: ['[data-sentry-mask]'],
    }),
  ],
  /** PII 기본 마스킹 */
  sendDefaultPii: false,
  /** 브라우저 확장·네트워크 취소 등 우리 코드와 무관한 노이즈 제외 */
  ignoreErrors: [
    'Network Error',
    'Failed to fetch',
    'Load failed',
    'AbortError',
    'The operation was aborted',
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Non-Error promise rejection captured',
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
