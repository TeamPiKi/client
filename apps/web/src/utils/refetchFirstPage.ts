import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query';

export const refetchFirstPage = async (queryClient: QueryClient, queryKey: QueryKey) => {
  queryClient.setQueryData<InfiniteData<unknown>>(
    queryKey,
    data => data && { pages: data.pages.slice(0, 1), pageParams: data.pageParams.slice(0, 1) }
  );
  await queryClient.refetchQueries({ queryKey, exact: true }, { throwOnError: true });
};
