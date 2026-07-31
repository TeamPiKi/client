import type { ApiErrorResponseT, ApiResponseT } from '@/types/api';

/** 팀 응답 규약 `{ data, detail, code }` 성공 래핑 — 성공 응답의 code 는 항상 null */
export const createApiSuccess = <T>(data: T): ApiResponseT<T> => ({
  data,
  detail: '요청이 정상적으로 처리되었습니다.',
  code: null,
});

type CreateApiErrorOptionsT = {
  detail?: string;
  code?: string;
};

/** 팀 응답 규약 에러 래핑 — HTTP status 는 응답 본문이 아니라 실제 status code 로 내려간다 */
export const createApiError = ({
  detail = 'E2E 목 에러 응답입니다.',
  code = 'COMMON-INVALID-INPUT',
}: CreateApiErrorOptionsT = {}): ApiErrorResponseT => ({
  data: null,
  detail,
  code,
});
