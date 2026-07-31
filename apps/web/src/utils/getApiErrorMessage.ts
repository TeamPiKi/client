import { DEFAULT_ERROR_MESSAGE, SERVER_ERROR_MESSAGE, getErrorMessageByCode } from '@piki/core';
import { isAxiosError } from 'axios';

import type { ApiErrorResponseT } from '@/types/api';

/**
 * 에러 사용자 노출 문구 변환 함수
 *
 * axios 에러 파싱만 담당하고, 문구 결정은 `@piki/core` 카탈로그에 위임한다.
 *
 * 우선순위: code → detail → generic
 * - code 없는 5xx: SERVER_ERROR_MESSAGE 반환
 * - code 없는 4xx: detail → DEFAULT_ERROR_MESSAGE 반환
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (!isAxiosError<ApiErrorResponseT>(error)) return DEFAULT_ERROR_MESSAGE;

  const { code, detail } = error.response?.data ?? {};

  const messageByCode = getErrorMessageByCode(code);
  if (messageByCode) return messageByCode;

  const status = error.response?.status;
  if (!status || status >= 500) return SERVER_ERROR_MESSAGE;

  return detail ?? DEFAULT_ERROR_MESSAGE;
};
