import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { postWishLink } from '@/apis/postWishLink';
import { ANALYTICS_EVENT } from '@/consts/analytics';
import { ROUTES } from '@/consts/route';
import type { ApiErrorResponseT } from '@/types/api';
import { logAnalyticsEvent } from '@/utils/analytics';

export const usePostWishLink = () => {
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
      if (pathname !== ROUTES.ARCHIVE_BASE) router.push(ROUTES.ARCHIVE('wish'));
    },
    onError: error => {
      if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

      const {
        status,
        data: { detail },
      } = error.response;

      if (status < 500) {
        const clientErrorMessage = detail ?? '요청을 처리하지 못했습니다.';
        toast.error(clientErrorMessage);
        return;
      }

      throw error;
    },
  });

  return { postWishLinkMutation, isPostWishLinkPending, resetPostWishLinkMutation };
};
