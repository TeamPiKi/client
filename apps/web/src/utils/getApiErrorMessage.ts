import { isAxiosError } from 'axios';

import type { ApiErrorResponseT } from '@/types/api';

const DEFAULT_ERROR_MESSAGE = '요청 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.';

/**
 * API 에러 → 사용자 표시 문구 (팀 에러 메시지 정책 #305).
 *
 * - 4xx: 서버 `detail` 을 그대로 노출 — 문구의 SSOT 는 서버 (프론트 code 매핑 X)
 * - 5xx/네트워크 오류: 서버 detail 이 사용자용 문구가 아니므로 fallback 사용
 * - fallback 은 컨텍스트에 맞는 문구를 호출부에서 넘길 수 있다 (예: '마감 시각을 변경하지 못했어요.')
 */
export const getApiErrorMessage = (error: unknown, fallback = DEFAULT_ERROR_MESSAGE): string => {
  if (isAxiosError<ApiErrorResponseT>(error) && error.response) {
    const { status, data } = error.response;
    if (status < 500 && data?.detail) return data.detail;
  }

  return fallback;
};
