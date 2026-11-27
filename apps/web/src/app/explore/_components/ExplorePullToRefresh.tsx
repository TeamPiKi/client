'use client';

import { useQueryClient } from '@tanstack/react-query';

import PullToRefresh from '@/components/common/pull-to-refresh';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { refetchFirstPage } from '@/utils/refetchFirstPage';

function ExplorePullToRefresh() {
  const queryClient = useQueryClient();
  const pullToRefresh = usePullToRefresh(() =>
    Promise.all([
      refetchFirstPage(queryClient, QUERY_KEYS.EXPLORE.WINNERS),
      refetchFirstPage(queryClient, QUERY_KEYS.EXPLORE.FRIEND_WISHES(null)),
      refetchFirstPage(queryClient, QUERY_KEYS.EXPLORE.RECENT),
    ])
  );

  return <PullToRefresh {...pullToRefresh} />;
}

export default ExplorePullToRefresh;
