import type { ApiErrorResponseT, ApiResponseT } from '@/types/api';

/**
 * 팀 응답 규약 `{ data, code, pageResponse }` 성공 래핑 — 성공 응답의 code 는 항상 null.
 * 페이징 응답은 `pageResponse` 를 넘겨 덮어쓴다.
 */
export const createApiSuccess = <T>(
  data: T,
  pageResponse: ApiResponseT<T>['pageResponse'] = { nextCursor: null, hasNext: false }
): ApiResponseT<T> => ({
  data,
  code: null,
  pageResponse,
});

type CreateApiErrorOptionsT = {
  code?: string;
};

/**
 * 팀 응답 규약 에러 래핑 — HTTP status 는 응답 본문이 아니라 실제 status code 로 내려간다.
 * 사용자 문구는 `code` 로만 결정되므로 목도 `code` 만 지정한다.
 */
export const createApiError = ({
  code = 'COMMON-INVALID-INPUT',
}: CreateApiErrorOptionsT = {}): ApiErrorResponseT => ({
  data: null,
  code,
});
