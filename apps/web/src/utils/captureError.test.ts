import * as Sentry from '@sentry/nextjs';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { describe, expect, it, vi } from 'vitest';

import type { ApiErrorResponseT } from '@/types/api';

import { captureApiError } from './captureError';

vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }));

const config = { method: 'post', url: '/api/v1/wishes/123?x=1' } as InternalAxiosRequestConfig;

const axiosError = ({ code, status }: { code?: string; status?: number }) => {
  const response = status
    ? ({ status, data: { data: null, code: 'WISH-004' } } as AxiosResponse<ApiErrorResponseT>)
    : void 0;

  return new AxiosError<ApiErrorResponseT>('failed', code, config, void 0, response);
};

const captured = () => vi.mocked(Sentry.captureException).mock.calls;

describe('captureApiError', () => {
  it('5xx 는 메서드·status·경로로 ApiError 를 보낸다', () => {
    vi.mocked(Sentry.captureException).mockClear();

    captureApiError(axiosError({ code: 'ERR_BAD_RESPONSE', status: 500 }), 'api-client');

    const [error, context] = captured()[0] ?? [];
    expect((error as Error).name).toBe('ApiError');
    expect((error as Error).message).toBe('API 500 POST /api/v1/wishes/123');
    expect(context).toMatchObject({
      tags: { source: 'api-client', errorType: 'server' },
      fingerprint: ['api', 'POST', '500', '/api/v1/wishes/:id'],
    });
  });

  it('응답 없는 서버 네트워크 오류는 ERR_NETWORK 가 아니어도 보낸다', () => {
    vi.mocked(Sentry.captureException).mockClear();

    captureApiError(axiosError({ code: 'ECONNREFUSED' }), 'api-server');
    captureApiError(axiosError({ code: 'ECONNABORTED' }), 'api-client');

    expect(captured().map(([error]) => (error as Error).message)).toEqual([
      'API ECONNREFUSED POST /api/v1/wishes/123',
      'API ECONNABORTED POST /api/v1/wishes/123',
    ]);
    expect(captured()[0]?.[1]).toMatchObject({ tags: { errorType: 'network' } });
  });

  it('4xx 와 취소된 요청은 보내지 않는다', () => {
    vi.mocked(Sentry.captureException).mockClear();

    captureApiError(axiosError({ code: 'ERR_BAD_REQUEST', status: 401 }), 'api-client');
    captureApiError(axiosError({ code: 'ERR_BAD_REQUEST', status: 404 }), 'api-client');
    captureApiError(axiosError({ code: 'ERR_CANCELED' }), 'api-client');

    expect(captured()).toHaveLength(0);
  });
});
