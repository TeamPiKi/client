import { clientApi } from '@/apis/client';
import type { NotificationListDataT } from '@/types/notification';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';

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

  const { data } = await clientApi.get<GetNotificationsResponseT>(
    `${ENDPOINTS.NOTIFICATIONS}?${params.toString()}`
  );

  return {
    items: data.data.items,
    unreadCount: data.data.unreadCount,
    nextCursor: data.pageResponse.nextCursor,
    hasNext: data.pageResponse.hasNext,
  };
};
