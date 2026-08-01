import { WEBBRIDGE_MESSAGE_TYPE } from '@piki/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import { deleteCookie } from '@/utils/cookie';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { WebBridge, isWebview } from '@/utils/webBridge';

import { deleteMe } from '../_apis/deleteMe';

export const useDeleteMe = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteMeMutation, isPending: isDeleteMePending } = useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      if (isWebview()) {
        deleteCookie('access_token');
        deleteCookie('refresh_token');

        WebBridge.postMessage({ type: WEBBRIDGE_MESSAGE_TYPE.WEB_REQ_LOGOUT });
      }

      queryClient.clear();
      router.replace(ROUTES.ROOT);
    },
    onError: error => {
      if (!isAxiosError(error) || !error.response) return;

      const { status } = error.response;

      if (status === 401 || status >= 500) return;

      /**
       * 403: 게스트는 탈퇴 불가
       * 404: 존재하지 않는 계정
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { deleteMeMutation, isDeleteMePending };
};
