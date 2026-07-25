import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getQueryClient } from '@/utils/queryClient';

import { getNotifications } from './_apis/getNotifications';
import NotificationContent from './_components/NotificationContent';

function Notification() {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery({
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
