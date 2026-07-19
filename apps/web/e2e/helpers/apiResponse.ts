import type { ApiErrorResponseT, ApiResponseT } from '@/types/api';

/** 팀 응답 규약 `{ status, data, detail, code }` 성공 래핑 */
export const createApiSuccess = <T>(data: T, status = 200): ApiResponseT<T> => ({
  status,
  data,
  detail: '요청이 정상적으로 처리되었습니다.',
  code: 'COMMON_SUCCESS',
});

type CreateApiErrorOptionsT = {
  status?: number;
  detail?: string;
  code?: string;
};

/** 팀 응답 규약 에러 래핑 */
export const createApiError = ({
  status = 400,
  detail = 'E2E 목 에러 응답입니다.',
  code = 'E2E_ERROR',
}: CreateApiErrorOptionsT = {}): ApiErrorResponseT => ({
  status,
  data: null,
  detail,
  code,
});
