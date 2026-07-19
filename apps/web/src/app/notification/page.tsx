import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getQueryClient } from '@/utils/queryClient';

import { getNotifications } from './_apis/getNotifications';
import NotificationContent from './_components/NotificationContent';

function Notification() {
  const queryClient = getQueryClient();

  // await 하지 않음 — pending 상태로 dehydrate 되어 스트리밍 (전환 논블로킹).
  // 클라이언트 useInfiniteQuery 의 isPending 분기가 로딩 상태를 담당한다.
  void queryClient.prefetchInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => getNotifications({ cursor: pageParam as string | null }),
    initialPageParam: null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationContent />
    </HydrationBoundary>
  );
}

export default Notification;
