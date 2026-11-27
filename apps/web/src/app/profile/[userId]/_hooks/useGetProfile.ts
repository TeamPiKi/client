import { useSuspenseQuery } from '@tanstack/react-query';

import { profileQueryOptions } from '../_apis/getProfile';

export const useGetProfile = (userId: string) => {
  const { data: profileData } = useSuspenseQuery(profileQueryOptions(userId));

  return { profileData };
};
