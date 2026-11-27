import * as Sentry from '@sentry/react-native';

type CaptureErrorContextT = {
  /** 검색/그룹핑용 태그 (예: { source: 'webview' }) */
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

export const captureApiError = (
  api: string,
  {
    status,
    tags,
    extra,
  }: { status?: number; tags?: Record<string, string>; extra?: Record<string, unknown> } = {}
) => {
  const reason = status ? String(status) : 'NETWORK';
  const error = new Error(`API ${reason} ${api}`);
  error.name = 'ApiError';

  captureError(error, {
    tags: { errorType: status ? 'server' : 'network', ...tags },
    extra: { status, ...extra },
    fingerprint: ['api', api, reason],
  });
};

/** React Native fetch 는 응답을 못 받으면 이 TypeError 를 던진다 */
export const isNetworkError = (error: unknown) =>
  error instanceof TypeError && error.message === 'Network request failed';
