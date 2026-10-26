import * as Sentry from '@sentry/nextjs';
import { isAxiosError } from 'axios';

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

/** API(axios) 에러는 인터셉터(apis/client.ts·server.ts)가 5xx·네트워크만 단독 수집 — 여기선 그 외 에러만 보낸다 */
export const captureNonApiError = (error: unknown) => {
  if (!isAxiosError(error)) Sentry.captureException(error);
};

