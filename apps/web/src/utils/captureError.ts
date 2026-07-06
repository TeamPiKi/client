import * as Sentry from '@sentry/nextjs';

type CaptureErrorContextT = {
  /** 검색/그룹핑용 태그 (예: { source: 'api-client' }) */
  tags?: Record<string, string>;
  /** 디버깅용 부가 정보 (요청 URL, status 등) */
  extra?: Record<string, unknown>;
};

/** 잡은(caught) 에러를 Sentry에 수동 리포트 — 태그/컨텍스트를 일관되게 부착 */
export const captureError = (error: unknown, context?: CaptureErrorContextT) => {
  Sentry.captureException(error, {
    tags: context?.tags,
    extra: context?.extra,
  });
};
