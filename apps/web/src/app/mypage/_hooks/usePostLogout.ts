import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import * as Sentry from '@sentry/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { logout } from '@/app/mypage/_actions/logout';
import { ROUTES } from '@/consts/route';
import { deleteCookie } from '@/utils/cookie';
import { WebBridge, isWebview } from '@/utils/webBridge';

import { postLogout } from '../_apis/postLogout';

export const usePostLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: postLogoutMutation, isPending: isPostLogoutPending } = useMutation({
    mutationFn: postLogout,
    onSettled: async () => {
      if (isWebview()) {
        deleteCookie('access_token');
        deleteCookie('refresh_token');

        WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_LOGOUT });
      }

      /** 다음 유저 세션에 이전 id가 남지 않도록 Sentry 유저 컨텍스트 해제 */
      Sentry.setUser(null);

      queryClient.clear();
      router.replace(ROUTES.LOGIN);
    },
    onError: async () => {
      if (!isWebview()) await logout();
    },
  });

  return { postLogoutMutation, isPostLogoutPending };
};
