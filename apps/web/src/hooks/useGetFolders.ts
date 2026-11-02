import { useSuspenseQuery } from '@tanstack/react-query';

import { foldersQueryOptions } from '@/apis/getFolders';

export const useGetFolders = () => {
  const { data: foldersData } = useSuspenseQuery(foldersQueryOptions);

  return { foldersData };
};
