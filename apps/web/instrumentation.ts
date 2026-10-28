import * as Sentry from '@sentry/nextjs';
import { isAxiosError } from 'axios';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') await import('./sentry.server.config');
  if (process.env.NEXT_RUNTIME === 'edge') await import('./sentry.edge.config');
}

export const onRequestError: typeof Sentry.captureRequestError = (error, request, errorContext) => {
  if (isAxiosError(error)) return;
  Sentry.captureRequestError(error, request, errorContext);
};
