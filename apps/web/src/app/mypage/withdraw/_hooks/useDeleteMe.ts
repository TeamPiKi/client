import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import * as Sentry from '@sentry/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { clearAuthCookies } from '@/app/mypage/_common/_actions/clearAuthCookies';
import { ROUTES } from '@/consts/route';
import { isGlobalNetError } from '@/utils/apiError';
import { deleteCookie } from '@/utils/cookie';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { WebBridge, isWebview } from '@/utils/webBridge';

import { deleteMe } from '../_apis/deleteMe';

export const useDeleteMe = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteMeMutation, isPending: isDeleteMePending } = useMutation({
    mutationFn: deleteMe,
    onSuccess: async () => {
      if (isWebview()) {
        deleteCookie('access_token');
        deleteCookie('refresh_token');

        WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_LOGOUT });
      } else {
        /** 웹인 경우 쿠키 삭제 */
        await clearAuthCookies();
      }

      Sentry.setUser(null);

      queryClient.clear();
      router.replace(ROUTES.ROOT);
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      /**
       * 403: 게스트는 탈퇴 불가
       * 404: 존재하지 않는 계정
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { deleteMeMutation, isDeleteMePending };
};
