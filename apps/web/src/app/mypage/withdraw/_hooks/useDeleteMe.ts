import * as Sentry from '@sentry/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import { isGlobalNetError } from '@/utils/apiError';
import { clearAuthSession } from '@/utils/clearAuthSession';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { deleteMe } from '../_apis/deleteMe';

export const useDeleteMe = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteMeMutation, isPending: isDeleteMePending } = useMutation({
    mutationFn: deleteMe,
    onSuccess: async () => {
      await clearAuthSession();

      Sentry.setUser(null);

      queryClient.clear();
      router.replace(ROUTES.LOGIN);
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
