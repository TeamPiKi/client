import * as Sentry from '@sentry/react-native';
import type { ReactNativeOptions } from '@sentry/react-native';

export const initSentry = (options: ReactNativeOptions = {}) => {
  const stage = process.env.EXPO_PUBLIC_STAGE;

  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: stage,
    enabled: stage === 'production' || stage === 'staging',
    tracesSampleRate: 0,
    sendDefaultPii: false,
    ...options,
  });
};
