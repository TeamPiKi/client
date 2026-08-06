import type { ERROR_MESSAGE_MAP } from '../consts/errorCode';

/** 카탈로그에 정의된 에러 코드 */
export type ErrorCodeT = keyof typeof ERROR_MESSAGE_MAP;

/**
 * 응답 body 의 `code` 필드 타입.
 * 알려진 코드는 자동완성되면서, 카탈로그에 아직 없는 신규 코드도 받을 수 있다.
 */
export type ApiErrorCodeT = ErrorCodeT | (string & {});
