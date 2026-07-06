import * as Sentry from '@sentry/nextjs';
import { MutationCache, QueryCache, QueryClient, environmentManager } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { cache } from 'react';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

/** REF: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr */

const makeQueryClient = () => {
  return new QueryClient({
    /** mutation — 사용자 액션 실패: 토스트 + (Sentry) 로깅 */
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        const status = isAxiosError(error) ? error.response?.status : null;

        /** 401은 전역 인터셉터(apis/client.ts)가 refresh·redirect로 처리 → 이중 토스트 방지 */
        if (status === 401) return;

        /** 5xx·네트워크는 전역이 단독 처리 (개별 onError는 5xx를 건드리지 않음) */
        if (!status || status >= 500) {
          toast.error(getApiErrorMessage(error));
          Sentry.captureException(error);
          return;
        }

        /** 4xx: 개별 onError 있으면 양보, 없으면 generic fallback */
        if (mutation.options.onError) return;
        toast.error(getApiErrorMessage(error));
      },
    }),
    /** query — 데이터 fetch 실패: 토스트 X, 로깅만 (표시는 boundary/isError가 담당) */
    queryCache: new QueryCache({
      onError: _error => {
        Sentry.captureException(_error);
      },
    }),
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
