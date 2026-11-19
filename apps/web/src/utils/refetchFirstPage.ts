import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';

export const refetchFirstPage = async (queryClient: QueryClient, queryKey: QueryKey) => {
  const previousData = queryClient.getQueryData<InfiniteData<unknown>>(queryKey);
  const firstPageData = queryClient.setQueryData<InfiniteData<unknown>>(
    queryKey,
    data => data && { pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1) }
  );

  try {
    await queryClient.refetchQueries({ queryKey, exact: true }, { throwOnError: true });
  } catch (error) {
    if (queryClient.getQueryData(queryKey) === firstPageData)
      queryClient.setQueryData(queryKey, previousData);
    throw error;
  }
};
