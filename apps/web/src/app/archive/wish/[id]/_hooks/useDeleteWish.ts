import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { deleteWish } from '@/apis/deleteWish';
import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import type { ApiErrorResponseT } from '@/types/api';

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
      if (!isAxiosError<ApiErrorResponseT>(error) || !error.response) return;

      const {
        status,
        data: { detail },
      } = error.response;

      const clientErrorMessage = detail ?? '요청을 처리하지 못했습니다.';

      /**
       * 403: 위시 삭제 권한 없음
       * 404: 위시 존재하지 않음
       */
      if (status === 403 || status === 404) toast.error(clientErrorMessage);
    },
  });

  return { deleteWishMutation, isDeleteWishPending };
};
