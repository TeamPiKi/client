import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteWish } from '@/apis/deleteWish';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

/** 위시 단건 삭제 */
export const useDeleteWish = (wishId: number) => {
  const backWithFallback = useBackWithFallback();
  const queryClient = useQueryClient();

  const { mutate: deleteWishMutation, isPending: isDeleteWishPending } = useMutation({
    mutationFn: () => deleteWish(wishId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success('위시 상품이 삭제되었습니다.');
      backWithFallback(ROUTES.WISHLIST);
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      /**
       * 403: 위시 삭제 권한 없음
       * 404: 위시 존재하지 않음
       */
      toast.error(getApiErrorMessage(error));
    },
  });

  return { deleteWishMutation, isDeleteWishPending };
};
