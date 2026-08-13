import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/consts/queryKeys';
import { WebBridge, isWebview } from '@/utils/webBridge';

import { postNotificationsRead } from '../_apis/postNotificationsRead';

export const usePostNotificationsRead = () => {
  const queryClient = useQueryClient();

  const { mutate: postNotificationsReadMutation, isPending: isPostNotificationsReadPending } =
    useMutation({
      mutationFn: postNotificationsRead,
      onSuccess: data => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION.LIST });
        if (isWebview() && data) {
          WebBridge.postMessage({
            type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_SET_BADGE,
            payload: { count: data.unreadCount },
          });
        }
      },
    });

  return { postNotificationsReadMutation, isPostNotificationsReadPending };
};
