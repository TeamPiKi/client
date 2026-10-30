import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { wishesInfiniteQueryOptions } from '@/apis/getWishes';
import { useGetWishes } from '@/hooks/useGetWishes';

export const useFolderWishes = (folderId: number | null) => {
  const allWishes = useGetWishes();

  const folderWishes = useInfiniteQuery({
    ...wishesInfiniteQueryOptions({ folderId: folderId ?? 0 }),
    enabled: folderId !== null,
    placeholderData: keepPreviousData,
  });

  if (folderId === null) return { ...allWishes, allWishesData: allWishes.wishesData };

  return {
    allWishesData: allWishes.wishesData,
    wishesData: folderWishes.data?.pages.flatMap(page => page.data) ?? [],
    fetchNextPage: folderWishes.fetchNextPage,
    hasNextPage: folderWishes.hasNextPage,
    isFetchingNextPage: folderWishes.isFetchingNextPage,
  };
};
