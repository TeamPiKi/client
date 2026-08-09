import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/consts/route';
import { getApiErrorStatus, isGlobalNetError } from '@/utils/apiError';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { patchWish } from '../_apis/patchWish';
import type { PatchWishRequestT } from '../_types/wish';

export const usePatchWish = (wishId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: patchWishMutation, isPending: isPatchWishPending } = useMutation({
    mutationFn: (body: PatchWishRequestT) => {
      const formData = new FormData();
      if (body.name) formData.append('name', body.name);
      if (body.price) formData.append('price', String(body.price));
      if (body.image) formData.append('image', body.image);
      if (body.memo) formData.append('memo', body.memo);
      return patchWish(wishId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wish', wishId] });
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
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
