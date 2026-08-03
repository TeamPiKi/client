// 공통 성공 응답 타입
export type ApiResponseT<T> = {
  status: number;
  data: T;
  detail: string;
  code: string;
  pageResponse: {
    nextCursor: string | null;
    hasNext: boolean;
  };
};

// 공통 에러 응답 타입
export type ApiErrorResponseT = {
  status: number;
  data: null;
  detail: string;
  code: string;
};
