import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import { useBackWithFallback } from '@/hooks/useBackWithFallback';
import type { PatchItemRequestT } from '@/types/item';
import { getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { patchWish } from '../_apis/patchWish';

export const usePatchWish = (wishId: number) => {
  const router = useRouter();
  const backWithFallback = useBackWithFallback();
  const queryClient = useQueryClient();

  const { mutate: patchWishMutation, isPending: isPatchWishPending } = useMutation({
    mutationFn: (body: PatchItemRequestT) => {
      const formData = new FormData();
      if (body.name) formData.append('name', body.name);
      if (body.price) formData.append('price', String(body.price));
      if (body.image) formData.append('image', body.image);
      return patchWish(wishId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wish', wishId] });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      backWithFallback(ROUTES.WISHLIST);
    },
    onError: error => {
      if (isGlobalNetError(error)) return;

      toast.error(getApiErrorMessage(error));

      /**
       * 403: 위시 수정 권한 없음
       * 404: 위시 존재하지 않음
       */
      const status = getApiErrorStatus(error);
      if (status === 403 || status === 404) router.replace(ROUTES.WISHLIST);
    },
  });

  return { patchWishMutation, isPatchWishPending };
};
