import { ERROR_MESSAGE_MAP } from '../consts/errorCode';
import type { ApiErrorCodeT } from '../types/error';

/**
 * 에러 코드에 매핑된 사용자 노출 문구를 반환하는 순수 조회 헬퍼.
 *
 * 카탈로그에 없는 code(신규 코드·null 등)는 `undefined` 를 반환한다.
 * fallback 정책(generic 문구 선택)은 호출하는 쪽에서 결정한다.
 */
export const getErrorMessageByCode = (code: ApiErrorCodeT | null | undefined) => {
  if (!code) return undefined;

  return (ERROR_MESSAGE_MAP as Record<string, string>)[code];
};
