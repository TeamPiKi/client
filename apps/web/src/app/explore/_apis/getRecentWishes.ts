import { infiniteQueryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';

import { RECENT_WISHES_MOCK } from '../_common/_consts/exploreMock';
import type { RecentWishT } from '../_common/_types/explore';

const PAGE_SIZE = 20;

/** TEMP: API 스펙 확정 전이라 목데이터를 커서 페이지네이션 응답 형태로 잘라 반환함. 담긴 시각은 요청 시점 기준으로 채움 */
export const getRecentWishes = async (
  cursor: string | null = null
): Promise<ApiResponseT<RecentWishT[]>> => {
  const start = cursor ? Number(cursor) : 0;
  const end = start + PAGE_SIZE;
  const hasNext = end < RECENT_WISHES_MOCK.length;

  return {
    data: RECENT_WISHES_MOCK.slice(start, end).map((wish, index) => ({
      ...wish,
      savedAt: new Date(Date.now() - ((start + index) * 3 + 5) * 60 * 1000).toISOString(),
    })),
    code: null,
    pageResponse: { hasNext, nextCursor: hasNext ? String(end) : null },
  };
};

export const recentWishesInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: QUERY_KEYS.EXPLORE.RECENT,
  queryFn: ({ pageParam }) => getRecentWishes(pageParam),
  initialPageParam: null as string | null,
  getNextPageParam: page => (page.pageResponse.hasNext ? page.pageResponse.nextCursor : null),
});
