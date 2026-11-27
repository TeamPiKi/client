'use client';

import { useQueryClient } from '@tanstack/react-query';

import PullToRefresh from '@/components/common/pull-to-refresh';
import { QUERY_KEYS } from '@/consts/queryKeys';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { refetchFirstPage } from '@/utils/refetchFirstPage';

function WinnerPullToRefresh() {
  const queryClient = useQueryClient();
  const pullToRefresh = usePullToRefresh(() =>
    refetchFirstPage(queryClient, QUERY_KEYS.EXPLORE.WINNERS)
  );

  return <PullToRefresh {...pullToRefresh} />;
}

export default WinnerPullToRefresh;
