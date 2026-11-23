import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TOAST_ACTION_DURATION_MS } from '@/components/toast/toast.const';
import { ROUTES } from '@/consts/route';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { postExploreWish } from '../_apis/postExploreWish';

/** 다른 사람의 위시를 내 전체 위시에 담기 */
export const usePostExploreWish = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: postExploreWishMutation, isPending: isPostExploreWishPending } = useMutation({
    mutationFn: postExploreWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast('내 위시에 상품을 담았어요', {
        duration: TOAST_ACTION_DURATION_MS,
        action: { label: '보러가기', onClick: () => router.push(ROUTES.WISHLIST) },
      });
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));
    },
  });

  return { postExploreWishMutation, isPostExploreWishPending };
};
