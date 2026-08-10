import { clientApi } from '@/apis/client';
import { ENDPOINTS } from '@/consts/api';
import type { ApiResponseT } from '@/types/api';
import type { NotificationListDataT } from '@/types/notification';

type GetNotificationsRequestT = {
  cursor?: string | null;
  size?: number;
};

export const getNotifications = async ({ cursor, size = 10 }: GetNotificationsRequestT = {}) => {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  params.set('size', String(size));

  const { data } = await clientApi.get<ApiResponseT<NotificationListDataT>>(
    `${ENDPOINTS.NOTIFICATIONS}?${params.toString()}`
  );

  return {
    items: data.data.items,
    unreadCount: data.data.unreadCount,
    nextCursor: data.pageResponse.nextCursor,
    hasNext: data.pageResponse.hasNext,
  };
};
