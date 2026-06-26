import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { isWebview, WebBridge } from '@/utils/webBridge';

import { getNotifications } from '../_apis/getNotifications';

export const useGetNotifications = () => {
  const {
    data: notificationsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => getNotifications({ cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: lastPage => (lastPage.hasNext ? (lastPage.nextCursor ?? null) : null),
  });

  const notifications = notificationsData?.pages.flatMap(page => page.items) ?? [];
  const unreadCount = notificationsData?.pages[0]?.unreadCount ?? 0;

  useEffect(() => {
    if (!isWebview()) return;
    WebBridge.postMessage({
      type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_SET_BADGE,
      payload: { count: unreadCount },
    });
  }, [unreadCount]);

  return {
    notificationsData: notifications,
    unreadCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  };
};
