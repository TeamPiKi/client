// 공통 성공 응답 타입
export type ApiResponseT<T> = {
  data: T;
  detail: string;
  code: string;
};

// 공통 에러 응답 타입
export type ApiErrorResponseT = {
  data: null;
  detail: string;
  code: string;
};
