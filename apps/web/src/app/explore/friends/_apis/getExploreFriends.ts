import { queryOptions } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/consts/queryKeys';

import { FRIENDS_MOCK } from '../../_common/_consts/exploreMock';
import type { ExploreFriendT } from '../../_common/_types/explore';

/** TEMP: API 스펙 확정 전이라 목데이터를 반환함 — 최근 담은 친구 순, 비공개 친구는 서버에서 제외 */
export const getExploreFriends = async (): Promise<ExploreFriendT[]> => FRIENDS_MOCK;

export const exploreFriendsQueryOptions = queryOptions({
  queryKey: QUERY_KEYS.EXPLORE.FRIENDS,
  queryFn: getExploreFriends,
});
