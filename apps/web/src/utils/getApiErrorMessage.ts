import {
  DEFAULT_ERROR_MESSAGE,
  S3_UPLOAD_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE,
  getErrorMessageByCode,
} from '@piki/core';
import { isAxiosError } from 'axios';

import type { ApiErrorResponseT } from '@/types/api';
import { isS3UploadError } from '@/utils/apiError';

/**
 * 에러 사용자 노출 문구 변환 함수
 *
 * axios 에러 파싱만 담당하고, 문구 결정은 `@piki/core` 카탈로그에 위임한다.
 *
 * 우선순위: S3 업로드 전용 문구 → code → generic
 * - code 없는 5xx·네트워크 오류: SERVER_ERROR_MESSAGE 반환
 * - code 없는 4xx: DEFAULT_ERROR_MESSAGE 반환
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (isS3UploadError(error)) return S3_UPLOAD_ERROR_MESSAGE;

  if (!isAxiosError<ApiErrorResponseT>(error)) return DEFAULT_ERROR_MESSAGE;

  const messageByCode = getErrorMessageByCode(error.response?.data?.code);
  if (messageByCode) return messageByCode;

  const status = error.response?.status;
  if (!status || status >= 500) return SERVER_ERROR_MESSAGE;

  return DEFAULT_ERROR_MESSAGE;
};
