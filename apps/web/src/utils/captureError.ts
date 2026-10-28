import * as Sentry from '@sentry/nextjs';
import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';

import type { ApiErrorResponseT } from '@/types/api';

type CaptureErrorContextT = {
  /** 검색/그룹핑용 태그 (예: { source: 'api-client' }) */
  tags?: Record<string, string>;
  /** 디버깅용 부가 정보 (요청 URL, status 등) */
  extra?: Record<string, unknown>;
  fingerprint?: string[];
};

/** 잡은(caught) 에러를 Sentry에 수동 리포트 — 태그/컨텍스트를 일관되게 부착 */
export const captureError = (error: unknown, context?: CaptureErrorContextT) => {
  Sentry.captureException(error, {
    tags: context?.tags,
    extra: context?.extra,
    fingerprint: context?.fingerprint,
  });
};

const isServerOriginError = (error: unknown) =>
  error instanceof Error && 'digest' in error && typeof error.digest === 'string';

/** API(axios) 에러는 인터셉터(apis/client.ts·server.ts)가 5xx·네트워크만 단독 수집 — 여기선 그 외 에러만 보낸다 */
export const captureNonApiError = (error: unknown) => {
  if (isAxiosError(error) || isServerOriginError(error)) return;
  Sentry.captureException(error);
};

/** fingerprint 용 — 리소스 ID 가 달라도 같은 엔드포인트면 한 이슈로 묶는다 */
export const normalizeApiPath = (path: string) =>
  path.replace(/\/\d+(?=\/|$)/g, '/:id').replace(/\/[0-9a-f]{8}-[0-9a-f-]{27}(?=\/|$)/gi, '/:id');

/** 5xx 와 응답 없는 네트워크 오류만 수집 */
export const captureApiError = (error: AxiosError<ApiErrorResponseT>, source: string) => {
  const status = error.response?.status;
  if (error.code === 'ERR_CANCELED' || (typeof status === 'number' && status < 500)) return;

  const method = error.config?.method?.toUpperCase() ?? 'UNKNOWN';
  const path = error.config?.url?.split('?')[0] ?? 'unknown';
  const reason = String(status ?? error.code ?? 'NETWORK');

  const apiError = new Error(`API ${reason} ${method} ${path}`);
  apiError.name = 'ApiError';

  captureError(apiError, {
    tags: { source, errorType: status ? 'server' : 'network' },
    fingerprint: ['api', method, reason, normalizeApiPath(path)],
    extra: {
      url: error.config?.url,
      method: error.config?.method,
      status,
      code: error.code,
      apiCode: error.response?.data?.code,
    },
  });
};
