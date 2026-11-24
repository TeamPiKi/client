import { useSuspenseQuery } from '@tanstack/react-query';

import { friendsQueryOptions } from '../_apis/getFriends';

export const useGetFriends = () => {
  const { data: friendsData } = useSuspenseQuery(friendsQueryOptions);

  return { friendsData };
};
