import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { setCookie } from '@/utils/cookie';
import { getLoginRedirectPath } from '@/utils/loginRedirect';
import { WebBridge, isWebview } from '@/utils/webBridge';

import { postGuestLogin } from '../_apis/postGuestLogin';

export const usePostGuestLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: postGuestLoginMutation, isPending: isPostGuestLoginPending } = useMutation({
    mutationFn: postGuestLogin,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['me'] });

      if (isWebview() && data.accessToken && data.refreshToken) {
        setCookie('access_token', data.accessToken, { minutes: 15 });
        setCookie('refresh_token', data.refreshToken, { days: 14 });
        WebBridge.postMessage({
          type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_TOKEN_REFRESHED,
          payload: { accessToken: data.accessToken, refreshToken: data.refreshToken },
        });
      }

      router.replace(getLoginRedirectPath());
    },
  });

  return { postGuestLoginMutation, isPostGuestLoginPending };
};
