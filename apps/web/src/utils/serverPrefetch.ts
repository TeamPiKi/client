import { unstable_rethrow } from 'next/navigation';

/**
 * RSC 프리페치 — 조회 실패는 클라이언트 재조회에 맡기고 삼키되, redirect·notFound 는 통과시킨다.
 *
 * `queryClient.prefetchQuery` 는 내부가 `catch(noop)` 이라 serverApi 인터셉터가 던지는
 * 401 redirect 까지 삼켜버려 세션 만료 탈출이 동작하지 않는다.
 */
export const serverPrefetch = async (fetchQuery: () => Promise<unknown>) => {
  try {
    await fetchQuery();
  } catch (error) {
    unstable_rethrow(error);
  }
};
