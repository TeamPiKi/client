import { infiniteQueryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';

import { WINNER_WISHES_MOCK } from '../_consts/exploreMock';
import type { WinnerWishT } from '../_types/explore';

const PAGE_SIZE = 20;

/** TEMP: API 스펙 확정 전이라 목데이터를 커서 페이지네이션 응답 형태로 잘라 반환함 */
export const getWinnerWishes = async (
  cursor: string | null = null
): Promise<ApiResponseT<WinnerWishT[]>> => {
  const start = cursor ? Number(cursor) : 0;
  const end = start + PAGE_SIZE;
  const hasNext = end < WINNER_WISHES_MOCK.length;

  return {
    data: WINNER_WISHES_MOCK.slice(start, end),
    code: null,
    pageResponse: { hasNext, nextCursor: hasNext ? String(end) : null },
  };
};

export const winnerWishesInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: QUERY_KEYS.EXPLORE.WINNERS,
  queryFn: ({ pageParam }) => getWinnerWishes(pageParam),
  initialPageParam: null as string | null,
  getNextPageParam: page => (page.pageResponse.hasNext ? page.pageResponse.nextCursor : null),
});
