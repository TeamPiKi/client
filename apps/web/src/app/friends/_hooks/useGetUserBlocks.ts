import { useSuspenseQuery } from '@tanstack/react-query';

import { userBlocksQueryOptions } from '../_apis/getUserBlocks';

export const useGetUserBlocks = () => {
  const { data: userBlocksData } = useSuspenseQuery(userBlocksQueryOptions);

  return { userBlocksData };
};
