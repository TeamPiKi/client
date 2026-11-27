import { environmentManager, queryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';

import type { ExploreFriendT, GetFriendWishesResponseT } from '../../_common/_types/explore';

/** 친구가 담은 위시 응답에 함께 오는 상단 칩용 친구 목록만 쓰므로 위시는 1개만 받음 */
export const getExploreFriends = async (): Promise<ExploreFriendT[]> => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<ApiResponseT<GetFriendWishesResponseT>>(
    ENDPOINTS.EXPLORE_FRIENDS,
    { params: { size: 1 } }
  );

  return data.data.friends;
};

export const exploreFriendsQueryOptions = queryOptions({
  queryKey: QUERY_KEYS.EXPLORE.FRIENDS,
  queryFn: getExploreFriends,
});
