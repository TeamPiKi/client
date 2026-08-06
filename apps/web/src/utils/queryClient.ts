import * as Sentry from '@sentry/nextjs';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
  environmentManager,
} from '@tanstack/react-query';
import { cache } from 'react';
import { toast } from 'sonner';

import {
  getApiErrorStatus,
  isServerOrNetworkError,
  isWithdrawnAccountError,
} from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

/** REF: https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr */

const makeQueryClient = () => {
  return new QueryClient({
    /** mutation — 사용자 액션 실패: 토스트 + (Sentry) 로깅 */
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        /** 401·탈퇴 계정은 전역 인터셉터(apis/client.ts)가 refresh·redirect로 처리 → 이중 토스트 방지 */
        if (getApiErrorStatus(error) === 401 || isWithdrawnAccountError(error)) return;

        /** 5xx·네트워크는 전역이 단독 처리 (개별 onError는 5xx를 건드리지 않음) */
        if (isServerOrNetworkError(error)) {
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
      dehydrate: {
        // pending 쿼리도 dehydrate — RSC 가 prefetch 완료를 기다리지 않고 응답을 시작하고,
        // 진행 중인 promise 가 스트리밍으로 클라이언트에 전달된다 (페이지 전환 블로킹 제거의 전제)
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
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
