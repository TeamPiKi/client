import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { postWishOCR } from '@/apis/postWishOCR';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { getLoginPath } from '@/utils/loginRedirect';

export const usePostWishOCR = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const {
    mutate: postWishOCRMutation,
    isPending: isPostWishOCRPending,
    reset: resetPostWishOCRMutation,
  } = useMutation({
    mutationFn: (formData: FormData) => postWishOCR(formData),
    onSuccess: () => {
      logAnalyticsEvent(ANALYTICS_EVENT.WISH_ADD_COMPLETE, { source: 'ocr' });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      if (pathname !== ROUTES.WISHLIST) router.push(ROUTES.WISHLIST);
    },
    onError: error => {
      if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

      const { status } = error.response;

      if (status === 401 || status >= 500) return;

      /**
       * 400: 이미지 개수/형식/크기 초과
       * 403: 게스트인 경우
       * 409: 탈퇴한 계정
       */
      toast.error(getApiErrorMessage(error));

      if (status === 403)
        router.replace(getLoginPath(`${window.location.pathname}${window.location.search}`));
    },
  });

  return { postWishOCRMutation, isPostWishOCRPending, resetPostWishOCRMutation };
};
