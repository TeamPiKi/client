import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { postWishLink } from '@/apis/postWishLink';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import { logAnalyticsEvent } from '@/utils/analytics';
import { getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { getLoginPath } from '@/utils/loginRedirect';

type UsePostWishLinkOptionsT = {
  /** 입력 폼처럼 에러를 화면 안에서 안내하는 경우 false — 4xx 토스트를 끈다 */
  showErrorToast?: boolean;
};

export const usePostWishLink = ({ showErrorToast = true }: UsePostWishLinkOptionsT = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const {
    mutate: postWishLinkMutation,
    isPending: isPostWishLinkPending,
    reset: resetPostWishLinkMutation,
  } = useMutation({
    mutationFn: (url: string) => postWishLink(url),
    onSuccess: () => {
      logAnalyticsEvent(ANALYTICS_EVENT.WISH_ADD_COMPLETE, { source: 'link' });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      if (pathname !== ROUTES.WISHLIST) router.push(ROUTES.WISHLIST);
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      /**
       * 400: 링크 형식 오류·미지원 쇼핑몰
       * 403: 게스트인 경우
       * 409: 이미 등록된 상품
       */
      if (showErrorToast) toast.error(getApiErrorMessage(error));

      if (getApiErrorStatus(error) === 403)
        router.replace(getLoginPath(`${window.location.pathname}${window.location.search}`));
    },
  });

  return { postWishLinkMutation, isPostWishLinkPending, resetPostWishLinkMutation };
};
