import { QueryClient, environmentManager } from '@tanstack/react-query';
import { cache } from 'react';

/** REF: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr */

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined;

const getServerQueryClient = cache(makeQueryClient);

export const getQueryClient = () => {
  if (environmentManager.isServer()) return getServerQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();

  return browserQueryClient;
};
