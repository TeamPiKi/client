'use client';

import { useRouter } from 'next/navigation';

import Button from '@/components/button';
import { Header, HeaderIcon } from '@/components/header';
import Spacing from '@/components/spacing';
import { formatTimeKo } from '@/utils/formatDate';
import { isWebview } from '@/utils/webBridge';

import { useGetNotifications } from '../_hooks/useGetNotifications';
import useIntersectionObserver from '../_hooks/useIntersectionObserver';
import { usePostNotificationsRead } from '../_hooks/usePostNotificationsRead';
import { usePushPermission } from '../_hooks/usePushPermission';
import { getNotificationRoute } from '../_utils/getNotificationRoute';
import NotificationItem from './NotificationItem';
import NotificationStateCard from './NotificationStateCard';
import PushDisabledBanner from './PushDisabledBanner';

function NotificationContent() {
  const router = useRouter();
  const { openNotificationSettings, isPushEnabled } = usePushPermission();
  const {
    notificationsData,
    isPending,
    isError,
    isFetchNextPageError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetNotifications();
  const { postNotificationsReadMutation, isPostNotificationsReadPending } =
    usePostNotificationsRead();
  const isEmpty = !isPending && notificationsData.length === 0;

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    !!hasNextPage && !isFetchingNextPage && !isFetchNextPageError
  );

  const handleNotificationClick = (notification: (typeof notificationsData)[number]) => {
    if (isPostNotificationsReadPending) return;
    const route = getNotificationRoute(notification.type, notification.refId, {
      kind: notification.kind,
      tournamentId: notification.tournamentId,
    });
    postNotificationsReadMutation({ ids: [notification.id] });
    if (route) router.push(route);
  };

  return (
    <div className="flex h-dvh flex-col bg-gray-50 px-5 pt-padding-top">
      <Header left={<HeaderIcon name="BACK" />} center="알림 히스토리" centerClassName="title-1" />
      <Spacing size={16} />

      <div className="hide-scrollbar flex-1 overflow-y-auto pt-5">{renderContent()}</div>
    </div>
  );

  function renderContent() {
    if (isError && !isFetchNextPageError)
      return <NotificationStateCard variant="error" onAction={() => refetch()} />;
    if (isEmpty)
      return <NotificationStateCard variant="empty" onAction={openNotificationSettings} />;

    return (
      <div className="flex flex-col gap-4 pb-9">
        {isWebview() && isPushEnabled === false && (
          <PushDisabledBanner onOpenNotificationSettings={openNotificationSettings} />
        )}

        <div className="rounded-xl bg-base-50">
          <ul className="divide-y divide-gray-100 px-5">
            {notificationsData.map(notification => (
              <NotificationItem
                key={notification.id}
                message={notification.title}
                time={formatTimeKo(notification.createdAt)}
                profileImage={notification.imageUrl}
                isRead={notification.isRead}
                onClick={() => handleNotificationClick(notification)}
              />
            ))}
          </ul>
        </div>
        {isFetchNextPageError ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <p className="body-2-medium text-text-neutral-tertiary">알림을 더 불러오지 못했어요</p>
            <Button variant="secondary" size="sm" onClick={() => fetchNextPage()}>
              다시 시도
            </Button>
          </div>
        ) : (
          <div ref={bottomRef} />
        )}
      </div>
    );
  }
}

export default NotificationContent;
