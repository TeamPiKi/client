import { useSuspenseQuery } from '@tanstack/react-query';

import { exploreFriendsQueryOptions } from '../_apis/getExploreFriends';

export const useGetExploreFriends = () => {
  const { data: exploreFriendsData } = useSuspenseQuery(exploreFriendsQueryOptions);

  return { exploreFriendsData };
};
