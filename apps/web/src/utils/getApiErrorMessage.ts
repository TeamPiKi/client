import { DEFAULT_ERROR_MESSAGE, ERROR_MESSAGE_MAP } from '@piki/core';
import { isAxiosError } from 'axios';

import type { ApiErrorResponseT } from '@/types/api';

/**
 * 에러 사용자 노출 문구 변환 함수
 *
 * - code 매핑되면 매핑된 문구 반환
 * - code 없는 5xx: ERROR_MESSAGE_MAP['COMMON-SERVER-ERROR'] 반환
 * - code 없는 4xx: DEFAULT_ERROR_MESSAGE 반환
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (!isAxiosError<ApiErrorResponseT>(error)) return DEFAULT_ERROR_MESSAGE;

  const { code, detail } = error.response?.data ?? {};

  const messageByCode = ERROR_MESSAGE_MAP[code ?? ''];
  if (messageByCode) return messageByCode;

  const status = error.response?.status;
  if (!status || status >= 500) return ERROR_MESSAGE_MAP['COMMON-SERVER-ERROR']!;

  return detail ?? DEFAULT_ERROR_MESSAGE;
};
