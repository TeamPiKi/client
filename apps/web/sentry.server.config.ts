import * as Sentry from '@sentry/nextjs';

/** 배포 환경(production/staging/dev). Sentry 는 production/staging 에서만 수집 (dev·로컬 비활성) */
const stage = process.env.NEXT_PUBLIC_STAGE;
const enabled = stage === 'production' || stage === 'staging';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: stage,
  enabled,
  ...(process.env.NEXT_PUBLIC_WEB_VERSION ? { release: process.env.NEXT_PUBLIC_WEB_VERSION } : {}),
  tracesSampleRate: 0,
  sendDefaultPii: false,
});
