import { useQueryClient } from '@tanstack/react-query';

import { updateExploreSavedState } from '../_utils/updateExploreSavedState';

const EXPLORE_QUERY_KEY = ['explore'];

/** 탐색에서 담기·취소한 뒤 내 위시와 모든 탐색 캐시의 하트 상태를 맞춤 */
export const useExploreSavedCache = () => {
  const queryClient = useQueryClient();

  return async (
    isTarget: Parameters<typeof updateExploreSavedState>[1],
    nextState: Parameters<typeof updateExploreSavedState>[2]
  ) => {
    queryClient.invalidateQueries({ queryKey: ['wishlists'] });
    queryClient.invalidateQueries({ queryKey: ['folders'] });
    /** 담기·취소 전에 시작된 조회가 늦게 끝나 바뀐 상태를 덮어쓰지 않도록 먼저 취소 */
    await queryClient.cancelQueries({ queryKey: EXPLORE_QUERY_KEY });
    queryClient.setQueriesData({ queryKey: EXPLORE_QUERY_KEY }, data =>
      updateExploreSavedState(data, isTarget, nextState)
    );
  };
};
