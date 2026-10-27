import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import { getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { patchWish } from '../_apis/patchWish';
import type { PatchWishRequestT } from '../_types/wish';

export const usePatchWish = (wishId: number) => {
  const backWithFallback = useBackWithFallback();
  const queryClient = useQueryClient();

  const { mutate: patchWishMutation, isPending: isPatchWishPending } = useMutation({
    mutationFn: (body: PatchWishRequestT) => {
      const formData = new FormData();
      if (typeof body.name === 'string') formData.append('name', body.name);
      if (typeof body.price === 'number') formData.append('price', String(body.price));
      if (body.image) formData.append('image', body.image);
      if (typeof body.memo === 'string') formData.append('memo', body.memo);
      return patchWish(wishId, formData);
    },
    onSuccess: ({ wish }) => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['wish', wish.id] });

      /** 같은 상품을 가진 다른 위시에 합쳐진 경우 */
      if (wish.id !== wishId) router.replace(ROUTES.WISH_EDIT(wish.id));
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));

      /**
       * 403: 위시 수정 권한 없음
       * 404: 위시 존재하지 않음
       */
      const status = getApiErrorStatus(error);
      if (status === 403 || status === 404) backWithFallback(ROUTES.WISHLIST);
    },
  });

  return { patchWishMutation, isPatchWishPending };
};
