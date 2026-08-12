import { environmentManager } from '@tanstack/react-query';

import { clientApi } from '@/apis/client';
import { serverApi } from '@/apis/server';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { NotificationListDataT } from '@/types/notification';

type GetNotificationsResponseT = ApiResponseT<NotificationListDataT> & {
  pageResponse: {
    nextCursor: string | null;
    hasNext: boolean;
  };
};

type GetNotificationsRequestT = {
  cursor?: string | null;
  size?: number;
};

export const getNotifications = async ({ cursor, size = 10 }: GetNotificationsRequestT = {}) => {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  params.set('size', String(size));

  const url = `${ENDPOINTS.NOTIFICATIONS}?${params.toString()}`;
  const api = environmentManager.isServer() ? serverApi : clientApi;
  const { data } = await api.get<GetNotificationsResponseT>(url);

  return {
    items: data.data.items,
    unreadCount: data.data.unreadCount,
    nextCursor: data.pageResponse.nextCursor,
    hasNext: data.pageResponse.hasNext,
  };
};
