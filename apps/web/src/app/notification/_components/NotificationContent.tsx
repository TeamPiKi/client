'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { CheckCircledIconOutline } from '@/assets/icons';
import Button from '@/components/button';
import PullToRefresh from '@/components/common/pull-to-refresh';
import { QUERY_KEYS } from '@/consts/queryKeys';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { usePostNotificationsRead } from '@/hooks/usePostNotificationsRead';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { cn } from '@/utils/cn';
import { formatTimeKo } from '@/utils/formatDate';
import { refetchFirstPage } from '@/utils/refetchFirstPage';
import { isWebview } from '@/utils/webBridge';

import { useGetNotifications } from '../_hooks/useGetNotifications';
import { usePushPermission } from '../_hooks/usePushPermission';
import { getNotificationRoute } from '../_utils/getNotificationRoute';
import MarkAllReadDialog from './MarkAllReadDialog';
import NotificationItem from './NotificationItem';
import NotificationStateCard from './NotificationStateCard';
import PushDisabledBanner from './PushDisabledBanner';

function NotificationContent() {
  const router = useRouter();
  const { openNotificationSettings, isPushEnabled } = usePushPermission();
  const {
    notificationsData,
    unreadCount,
    isPending,
    isLoadingError,
    isFetchNextPageError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetNotifications();
  const { postNotificationsReadMutation, isPostNotificationsReadPending } =
    usePostNotificationsRead();
  const [isMarkAllReadDialogOpen, setIsMarkAllReadDialogOpen] = useState(false);
  const isEmpty = !isPending && notificationsData.length === 0;

  const handleMarkAllRead = () => setIsMarkAllReadDialogOpen(true);

  const queryClient = useQueryClient();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pullToRefresh = usePullToRefresh(
    () => refetchFirstPage(queryClient, QUERY_KEYS.NOTIFICATION.LIST),
    { scrollerRef }
  );

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    !!hasNextPage && !isFetchingNextPage && !isFetchNextPageError
  );

  const handleNotificationClick = (notification: (typeof notificationsData)[number]) => {
    if (isPostNotificationsReadPending) return;
    const route = getNotificationRoute(notification.type, notification.refId, {
      kind: notification.kind,
      tournamentId: notification.tournamentId,
      tournamentItemId: notification.tournamentItemId,
      wishId: notification.wishId,
    });
    postNotificationsReadMutation({ ids: [notification.id] });
    if (route) router.push(route);
  };

  return (
    <>
      <div ref={scrollerRef} className="mt-4 hide-scrollbar flex-1 overflow-y-auto">
        <PullToRefresh {...pullToRefresh} />
        {renderContent()}
      </div>

      <MarkAllReadDialog open={isMarkAllReadDialogOpen} onOpenChange={setIsMarkAllReadDialogOpen} />
    </>
  );

  function renderContent() {
    if (isLoadingError) return <NotificationStateCard variant="error" onAction={() => refetch()} />;
    if (isEmpty)
      return <NotificationStateCard variant="empty" onAction={openNotificationSettings} />;

    const isPushBannerVisible = isWebview() && isPushEnabled === false;

    return (
      <div className={cn('flex flex-col gap-4 pb-9')}>
        {isPushBannerVisible && (
          <div className="pt-5">
            <PushDisabledBanner onOpenNotificationSettings={openNotificationSettings} />
          </div>
        )}

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={isPostNotificationsReadPending}
            className="flex w-full cursor-pointer items-center justify-end gap-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircledIconOutline className="size-5 text-icon-neutral-secondary" aria-hidden />
            <span className="body-2-semibold text-text-neutral-secondary">모두 읽음</span>
          </button>
        )}

        <div className="rounded-xl bg-base-50">
          <ul className="divide-y divide-border-neutral-muted px-5">
            {notificationsData.map(notification => (
              <NotificationItem
                key={notification.id}
                kind={notification.kind}
                message={notification.title}
                body={notification.body}
                time={formatTimeKo(notification.createdAt)}
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

        {!isPending && !isFetchingNextPage && !isFetchNextPageError && !hasNextPage && (
          <p className="mt-3 text-center caption-1-regular text-text-neutral-tertiary">
            알림은 14일간 보관되며, 14일 후 자동 삭제돼요.
          </p>
        )}
      </div>
    );
  }
}

export default NotificationContent;
