import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { postWishOCR } from '@/apis/postWishOCR';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getLoginPath } from '@/utils/loginRedirect';

export const usePostWishOCR = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: postWishOCRMutation,
    isPending: isPostWishOCRPending,
    reset: resetPostWishOCRMutation,
  } = useMutation({
    mutationFn: (formData: FormData) => postWishOCR(formData),
    onSuccess: () => {
      logAnalyticsEvent(ANALYTICS_EVENT.WISH_ADD, { source: 'ocr' });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      router.push(ROUTES.ARCHIVE('wish'));
    },
    onError: error => {
      if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

      /**
       * 400: 이미지 개수/형식/크기 초과
       * 403: 게스트인 경우
       */
      if (error.response.status === 400) toast.error(error.response.data.detail);
      else if (error.response.status === 403) {
        toast.error(error.response.data.detail);
        router.replace(getLoginPath(`${window.location.pathname}${window.location.search}`));
      }
    },
  });

  return { postWishOCRMutation, isPostWishOCRPending, resetPostWishOCRMutation };
};
