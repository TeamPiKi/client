import type { NotificationItemT, NotificationListDataT } from '@/types/notification';

import { MOCK_IMAGE_URLS } from './images';

const createNotification = (
  overrides: Pick<NotificationItemT, 'id' | 'type' | 'title' | 'refId' | 'kind'> &
    Partial<NotificationItemT>
): NotificationItemT => ({
  category: 'ACTIVITY',
  body: '',
  imageUrl: MOCK_IMAGE_URLS.avatar,
  isRead: false,
  createdAt: '2026-01-01T09:00:00Z',
  ...overrides,
});

export const MOCK_NOTIFICATION_JOINED = createNotification({
  id: 1,
  type: 'TOURNAMENT_JOINED',
  title: '친구가 토너먼트에 참여했어요',
  refId: 1,
  kind: 'TOURNAMENT',
});

export const MOCK_NOTIFICATION_RESULT_READY = createNotification({
  id: 2,
  type: 'TOURNAMENT_RESULT_READY',
  title: '토너먼트 결과가 나왔어요',
  refId: 3,
  kind: 'TOURNAMENT',
});

export const MOCK_NOTIFICATION_ITEM_PARSED = createNotification({
  id: 3,
  type: 'ITEM_PARSING_COMPLETED',
  title: '상품 정보를 가져왔어요',
  refId: 11,
  kind: 'TOURNAMENT',
  tournamentId: 1,
  tournamentItemId: 11,
});

export const MOCK_NOTIFICATION_ANNOUNCEMENT = createNotification({
  id: 4,
  type: 'ANNOUNCEMENT',
  category: 'SYSTEM',
  title: 'PiKi 업데이트 안내',
  refId: 0,
  kind: 'SYSTEM',
  isRead: true,
});

const MOCK_NOTIFICATIONS = [
  MOCK_NOTIFICATION_JOINED,
  MOCK_NOTIFICATION_RESULT_READY,
  MOCK_NOTIFICATION_ITEM_PARSED,
  MOCK_NOTIFICATION_ANNOUNCEMENT,
];

export const MOCK_NOTIFICATION_LIST: NotificationListDataT = {
  items: MOCK_NOTIFICATIONS,
  unreadCount: 3,
  unreadCountByCategory: { ACTIVITY: 3, SYSTEM: 0 },
};

export const MOCK_NOTIFICATION_LIST_ALL_READ: NotificationListDataT = {
  items: MOCK_NOTIFICATIONS.map(notification => ({ ...notification, isRead: true })),
  unreadCount: 0,
  unreadCountByCategory: { ACTIVITY: 0, SYSTEM: 0 },
};

export const MOCK_NOTIFICATIONS_READ_RESPONSE = {
  unreadCount: 0,
  unreadCountByCategory: { ACTIVITY: 0, SYSTEM: 0 },
};
