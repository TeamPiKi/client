import { environmentManager, infiniteQueryOptions } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import { QUERY_KEYS } from '@/consts/queryKeys';
import type { ApiResponseT } from '@/types/api';

import type { FriendWishT, GetFriendWishesResponseT } from '../_types/explore';

export const getFriendWishes = async (
  friendId: string | null,
  cursor: string | null = null
): Promise<ApiResponseT<FriendWishT[]>> => {
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<ApiResponseT<GetFriendWishesResponseT>>(
    ENDPOINTS.EXPLORE_FRIENDS,
    { params: { size: 20, ...(friendId ? { friendId } : {}), ...(cursor ? { cursor } : {}) } }
  );

  return {
    ...data,
    data: data.data.wishes.map(({ wishId, item, friend }) => ({ wishId, item, friend })),
  };
};

export const friendWishesInfiniteQueryOptions = (friendId: string | null) =>
  infiniteQueryOptions({
    queryKey: QUERY_KEYS.EXPLORE.FRIEND_WISHES(friendId),
    queryFn: ({ pageParam }) => getFriendWishes(friendId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: page => (page.pageResponse.hasNext ? page.pageResponse.nextCursor : null),
  });
