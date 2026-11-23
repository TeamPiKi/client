import { useSuspenseQuery } from '@tanstack/react-query';

import { exploreFolderQueryOptions } from '../_apis/getExploreFolder';

export const useGetExploreFolder = (userId: string, folderId: number) => {
  const { data: exploreFolderData } = useSuspenseQuery(exploreFolderQueryOptions(userId, folderId));

  return { exploreFolderData };
};
