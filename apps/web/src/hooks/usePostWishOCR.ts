import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { postWishOCR } from '@/apis/postWishOCR';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
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
      if (isGlobalNetError(error)) return;

      /**
       * 400: 이미지 개수/형식/크기 초과
       * 403: 게스트인 경우
       */
      toast.error(getApiErrorMessage(error));

      if (getApiErrorStatus(error) === 403)
        router.replace(getLoginPath(`${window.location.pathname}${window.location.search}`));
    },
  });

  return { postWishOCRMutation, isPostWishOCRPending, resetPostWishOCRMutation };
};
