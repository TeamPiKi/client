import { isAxiosError } from 'axios';

import type { ApiErrorResponseT } from '@/types/api';

/**
 * 에러 사용자 노출 문구 변환 함수
 *
 * - 5xx·네트워크: 공통 "일시적 오류" 문구
 * - 4xx: 서버 detail 우선, 없으면 공통 "요청을 처리하지 못했어요."
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiErrorResponseT>(error)) {
    const status = error.response?.status;

    if (!status || status >= 500) return '일시적인 오류예요. 잠시 후 다시 시도해 주세요.';
    return error.response?.data?.detail ?? '요청을 처리하지 못했어요.';
  }

  return '요청을 처리하지 못했어요.';
};
