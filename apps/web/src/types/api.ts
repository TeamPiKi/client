import type { ApiErrorCodeT } from '@piki/core';

// 공통 성공 응답 타입
export type ApiResponseT<T> = {
  data: T;
  code: null;
};

// 공통 에러 응답 타입
export type ApiErrorResponseT = {
  data: null;
  code: ApiErrorCodeT;
};
